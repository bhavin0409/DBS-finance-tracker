"use server";


import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "../lib/prisma";

const serializeTransaction = (Obj) => {
    const serialize = {...Obj};

    if (Obj.balance) {
        serialize.balance = Obj.balance.toNumber();
    }
    if (Obj.amount) {
        serialize.amount = Obj.amount.toNumber();
    }
}

export async function createAccount(data) {
    try {
        const {userId} = await auth()
        if (!userId) throw new Error("unauthorized");
        

        const user = await db.user.findUnique({
            where: { clerkUserId : userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // convert balance to float before storing in db
        const balanceFloat = parseFloat(data.balance);

        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        // check if this is the user first account
        const existingAccount = await db.account.findMany({
            where: {userId : user.id},
        });

        const shouldBeDefault = existingAccount.length === 0 ? true : data.isDefault;

        // if account is set to default, unset all other accounts for this user
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId : user.id, isDefault: true},
                data: { isDefault: false}
            })
        }

        //create the account
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            }
        })

        const serializeAccount = serializeTransaction(account);
        revalidatePath("/dashboard");
        return { success: true, data: serializeAccount };
    } catch (error) {
        throw new Error(error.message);
    }
}
export async function getUserAccounts() {
    const {userId} = await auth()
        if (!userId) throw new Error("unauthorized");
        

        const user = await db.user.findUnique({
            where: { clerkUserId : userId },
        });

        if (!user) {
            throw new Error("User not found");
        }
        const accounts = await db.account.findMany({
            where: {userId : user.id},
            orderBy: { createdAt: 'desc' },
            include: { 
                _count:{
                select:{
                    transactions:true
                },
            },
         },
        });
    const serializeAccount = serializeTransaction(account);
    return serializeAccount;
    
}