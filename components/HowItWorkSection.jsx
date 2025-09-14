import { howItWorksData } from '@/data/landing'
import React from 'react'

const HowItsWorkSection = () => {
    return (
        <section className='py-20 bg-blue-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-16'>How It Works</h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {howItWorksData.map((item, index) => (
                    <div key={index} className='text-center px-4'>
                        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            {item.icon}
                        </div>
                        <h3 className='text-xl font-semibold mb-4'> {item.title} </h3>
                        <p className='text-gray-600'> {item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HowItsWorkSection