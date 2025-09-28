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
                const budgetAmount = budget.amount;
                const percentageUsed = (totalExpenses/budgetAmount) * 100;
                
                if (
                    percentageUsed >= 80 &&
                    (!budget.lastAlertSent || 
                        isNewMonth(new Date(budget.lastAlertSent) , new Date())
                    )
                ) {
                    // sent Email
                    await sendEmail({
                        to: budget.user.email,
                        subject: `Budget Alert For ${defaultAccount.name}`,
                        react: EmailTemplate({
                            userName:budget.user.name,
                            type:"budget-alert",
                            data:{
                                percentageUsed,
                                budgetAmount: parseInt(budgetAmount).toFixed(1),
                                totalExpenses: parseInt(totalExpenses).toFixed(1),
                                accountName: defaultAccount.name,
                            }
                        })
                    })
                    
                    // Update lastAlertSent
                    await db.budget.update({
                        where : { id : budget.id },
                        data: { lastAlertSent : new Date()}
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