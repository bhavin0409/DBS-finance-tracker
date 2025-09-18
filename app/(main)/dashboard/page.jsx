import CreateAccountDrawer from '@/components/dashboardComponent/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'

const DashboardPage = () => {
    return (
        <div className='px-5'>
            {/* Budget Progress */}

            {/* Dashboard Overview */}

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
            </div>
        </div>
    )
}

export default DashboardPage