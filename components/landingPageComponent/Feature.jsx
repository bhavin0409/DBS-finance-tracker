import { featuresData } from '@/data/landing'
import React from 'react'
import { Card, CardContent } from '../ui/card'

const Feature = () => {
    return (
        <section className='py-20 '>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-16'>Everything you need to manage your finances</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {featuresData.map((feature, index) => (
                        <Card key={index} className={"p-6 "}>
                            <CardContent className={"space-y-4 pt-4"}>
                                {feature.icon}
                                <h3 className='text-lg font-semibold'>{feature.title}</h3>
                                <p className='text-gray-600'>{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Feature