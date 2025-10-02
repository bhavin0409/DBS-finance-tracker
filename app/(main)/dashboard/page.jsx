import CreateAccountDrawer from '@/components/dashboardComponent/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React, { Suspense, cache } from 'react'
import { getDashboardData, getUserAccounts } from '@/actions/dashboard'
import AccountCard from './components/AccountCard'
import { getCurrentBudget } from '@/actions/budget'
import BudgetProgress from './components/BudgetProgress'
import DashboardOverview from './components/DashboardOverview'
import { checkUser } from '@/lib/checkUser'
import { redirect } from 'next/navigation'

const DashboardPage = async () => {
    const user = await checkUser();
    if (!user) {
        return redirect('/sign-in');
    }

    const getAccounts = cache(async () => await getUserAccounts());
    const getTransactions = cache(async () => await getDashboardData());
    
    const [accounts, transactions] = await Promise.all([getAccounts(), getTransactions()]);
    
    const defaultAccount = accounts?.find((account) => account.isDefault);
    const budgetData = defaultAccount ? await getCurrentBudget(defaultAccount.id) : null;

    return (
        <div className='space-y-8 pb-20'>
            {/* Budget Progress */}
            { defaultAccount && (
                <BudgetProgress 
                    initialBudget={budgetData?.budget}
                    currentExpenses={budgetData?.currentExpenses || 0}
                />
            )}
            {/* Dashboard Overview */}
            <Suspense fallback={"Loading Overview..."}>
                <DashboardOverview accounts={accounts} transactions={transactions || []}/>
            </Suspense>

            {/* Account Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <CreateAccountDrawer>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed">
                        <CardContent className='flex flex-col items-center justify-center text-muted-foreground h-full pt-5'>
                            <Plus className='h-10 w-10 mb-2'/>
                            <p className='text-sm font-medium'>Add Account</p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>

                {accounts.length > 0 && accounts?.map((account) => {
                    return <AccountCard key={account.id} account={account}/>
                })}
            </div>
        </div>
    )
}

export default DashboardPage