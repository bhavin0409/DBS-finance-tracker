import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const DashboardLayout = () => {
    return (
        <div className='px-5 pt-24'>
            <h1 className='text-5xl font-bold gradient-title mb-5'>Dashboard</h1>

            {/* Dashboard Page */}
            <Suspense fallback={<BarLoader className='mt-4' width={'100%'} color="#36d7b7" />}>
                <DashboardPage />
            </Suspense>
        </div>
    )
}

export default DashboardLayout