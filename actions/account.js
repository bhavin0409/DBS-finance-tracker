"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


const serializeTransaction = (Obj) => {
    const serialized = {...Obj};

    if (Obj.balance) {
        serialized.balance = Obj.balance.toNumber();
    }
    if (Obj.amount) {
        serialized.amount = Obj.amount.toNumber();
    }

    return serialized;
}

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId : userId }
        });

        if(!user) {
            throw new Error("User Not Found");
        }
        //// if account is set to default, unset all other account for this user
        await db.account.updateMany({
            where: { userId : user.id , isDefault: true},
            data: { isDefault: false}
        });

        const account = await db.account.update({
            where: { id : accountId , userId: user.id},
            data: {isDefault: true}
        });

        revalidatePath("/dashboard");

        return {success: true, data: serializeTransaction(account)};
        
    } catch (error) {
        return {success: false, data: error.message};
    }
}
export async function getAccountWithTransactions(accountId) {
 const { userId } = await auth();

        if (!userId) throw new Error("unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId : userId }
        });

        if(!user) {
            throw new Error("User Not Found");
        }
const account = await db.account.findUnique({
    where: { id : accountId , userId: user.id},
        include: {
            transactions: {
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: {transactions: true},
                },
        },        
   });
    if(!account) return null;
    return{
        ...serializeTransaction(account),
        transections: account.transactions.map(serializeTransaction),
    };
}