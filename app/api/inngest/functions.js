import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/template";
import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/prisma";


export const checkBudgetAlert = inngest.createFunction(
    { name: "Check Budget Alert" },
    { cron: "0 */6 * * *" },
    async ({ step }) => {
        const budgets = await step.run("fetch-budget", async () => {
            return await db.budget.findMany({
                include: {
                    user: {
                        include: {
                            accouts: {
                                where: {
                                    isDefault: true
                                }
                            }
                        }
                    }
                }
            })
        })

        for (const budget of budgets) {
            const defaultAccount = budget.user.accouts[0];

            if (!defaultAccount) {
                continue;
            }

            await step.run(`check-budget-${budget.id}`, async () => {
                const startOfMonth = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                );
                const endOfMonth = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                );
                const expenses = await db.transaction.aggregate({
                    where: {
                        userId: budget.userId,
                        type: 'EXPENSE',
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                        accountId: defaultAccount.id,
                    },
                    _sum: {
                        amount: true
                    }
                });

                const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                const budgetAmount = typeof budget.amount === "number"
                    ? budget.amount
                    : Number(budget.amount?.toString?.() ?? budget.amount);
                const percentageUsed = (totalExpenses / budgetAmount) * 100 || 0;

                if (
                    percentageUsed >= 80 &&
                    (!budget.lastAlertSent ||
                        isNewMonth(new Date(budget.lastAlertSent), new Date())
                    )
                ) {
                    // sent Email
                    await sendEmail({
                        to: budget.user.email,
                        subject: `Budget Alert For ${defaultAccount.name}`,
                        react: EmailTemplate({
                            userName: budget.user.name,
                            type: "budget-alert",
                            data: {
                                percentageUsed,
                                budgetAmount: parseInt(budgetAmount).toFixed(1),
                                totalExpenses: parseInt(totalExpenses).toFixed(1),
                                accountName: defaultAccount.name,
                            }
                        })
                    })

                    // Update lastAlertSent
                    await db.budget.update({
                        where: { id: budget.id },
                        data: { lastAlertSent: new Date() }
                    })
                }
            })
        }
    },
);

function isNewMonth(date1, date2) {
    return (
        date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth()
    );
}


export const processRecurringTransation = inngest.createFunction(
    {
        id: "process-recurring-transaction",
        throttle: {
            limit: 10, // Only Process 10 transation 
            period: "1m", // per minute
            key: "event.data.userId" // per user
        }
    },
    { event: "transaction.recurring.process" },
    async ({ event, step }) => {
        // validate event data
        if (!event?.data?.transactionId || !event?.data?.userId) {
            console.log("Invalid event data", event.data);
            return { error: "Missing recurring event data " }
        }

        await step.run("process-transaction", async () => {
            const transaction = await db.transaction.findUnique({
                where: {
                    id: event.data.transactionId,
                    userId: event.data.userId
                },
                include: {
                    account: true
                },
            });
            if (!transaction || !isTransactionDue(transaction)) return;

            await db.$transaction(async (tx) => {
                //create a transaction
                await tx.transaction.create({
                    data: {
                        type: transaction.type,
                        amount: transaction.amount,
                        description: `${transaction.description} (Recurring)`,
                        date: new Date(),
                        category: transaction.category,
                        userId: transaction.userId,
                        accountId: transaction.accountId,
                        isRecurring: false
                    },
                });

                //update account balance
                const changeBalance = transaction.type === "EXPENSE" ? -transaction.amount.toNumber() : transaction.amount.toNumber();

                await tx.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: { increment: changeBalance } },
                })

                //update last processed date and nextRecurringDate
                await tx.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        lastProcessed: new Date(),
                        nextRecurringDate: calculateNextRecurringDate(
                            new Date(),
                            transaction.recurringInterval
                        ),
                    },
                })
            })
        })
    }
);

export const triggerRecurringTransation = inngest.createFunction(
    {
        id: "trigger-recurring-transaction",
        name: "Trigger Recurring Transaction"
    },
    { cron: "0 0 * * *" },
    async ({ step }) => {
        //1. Fetch all due recurring transations
        const recurringTransations = await step.run(
            "fetch-recurring-transaction",
            async () => {
                return await db.transaction.findMany({
                    where: {
                        isRecurring: true,
                        status: "COMPLETED",
                        nextRecurringDate: {
                            lte: new Date(),
                        },
                    }
                })
            }
        )

        //2. Create event for each Transation
        if (recurringTransations.length > 0) {
            const events = recurringTransations.map((transaction) => (
                {
                    name: "transaction.recurring.process",
                    data: {
                        transactionId: transaction.id,
                        userId: transaction.userId,
                    }
                })
            );

            //3. send events to be processed
            await step.sendEvent("send-recurring-tx-events", events);
        }

        return { triggered: recurringTransations.length };
    }
);


function isTransactionDue(transaction) {
    // If it has never been processed, it's due.
    if (!transaction.lastProcessed) return true;
    // Otherwise, check if the next due date is today or in the past.
    const today = new Date();
    const nextDue = new Date(transaction.nextRecurringDate);
    return nextDue <= today;
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