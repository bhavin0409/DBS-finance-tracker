"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const serializeAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),
});

export async function createTransaction(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        //arcjet to add rate limiting
        const req = await request();
        //check rate limit
        const decision = await aj.protect(req , {
            userId,
            requested: 1 // how many tokens to consume
        })
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining , reset } = decision.reason;
                console.error({
                    code: "Rate limit exceeded",
                    details: {
                        remaining,
                        reset
                    }
                });

                throw new Error(`Too many requests. please try again in ${reset} seconds.`);
            }
            throw new Error("Request blocked");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        console.log('====================================');
        console.log(data.type , data.amount);
        console.log('====================================');
        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            });

            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}

const calculateNextRecurringDate = (startDate, interval) => {
    const date = new Date(startDate);
    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1)
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7)
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1)
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1)
            break;
    }
    return date;
};

export async function scanReceipt(file) {
    try {
        const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" })

        //convert file into arrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        //convert arrayBuffer into Base64
        const Base64 = Buffer.from(arrayBuffer).toString("base64")

        const prompt = `
        Analyze this receipt image and extract the following information in JSON format:
        - Total amount (just the number)
        - Date (in ISO format)
        - Description or items purchased (brief summary)
        - Merchant/store name
        - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
    
        Only respond with valid JSON in this exact format:
        {
            "amount": number,
            "date": "ISO date string",
            "description": "string",
            "merchantName": "string",
            "category": "string"
        }

        If its not a recipt, return an empty object
        `

        const result = await model.generateContent([
            {
                inlineData: {
                    data: Base64,
                    mimeType: file.type,
                },
            },
            prompt,
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanText = text
            .replace(/```(?:json)?/gi, "")
            .replace(/```/g, "")
            .trim();
            
        try {
            const data = JSON.parse(cleanText)
            return {
                amount: data.amount,
                date: data.date,
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            }
        } catch (parseError) {
            console.log("Error parsing JSON: ", parseError)
            throw new Error("Invalid response format from GEMINI")
        }
    } catch (error) {
        console.log("Error scanning receipt:", error.message)
        throw new Error("Failed to scan receipt")
    }
}

export async function getTransation(id){
    try {
        const {userId} = await auth();
        
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });

        if (!user) throw new Error("User not found");

        const transaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            }
        });

        if(!transaction) throw new Error("Transaction not found");

        return serializeAmount(transaction);
    } catch (error) {
        console.log("Error getting transaction: " , error.message);
        throw new Error(error)
    }
};

export async function updateTransaction(id , data){
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });
        if (!user) throw new Error("User not found");

        //get original transaction and balance check
        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true,
            }
        });

        if(!originalTransaction) throw new Error("Transaction not found");

        //calculate new balance change
        const oldBalanceChange = originalTransaction.type === "EXPENSE" ?
                                    -originalTransaction.amount.toNumber() :
                                    originalTransaction.amount.toNumber();

        const newBalanceChange = data.type === "EXPENSE" ?
                                    -data.amount :
                                    data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id,
                },
                data: {
                    ...data,
                    nextRecurringDate: data.isRecurring && data.recurringInterval
                        ? calculateNextRecurringDate(data.date , data.recurringInterval) : null,
                },
            });

            //update account balance 
            await tx.account.update({
                where: {
                    id: data.accountId
                },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    },
                },
            });

            return updated;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        console.log("Error updating transaction: " , error);
        throw new Error(error.message);
    }
}