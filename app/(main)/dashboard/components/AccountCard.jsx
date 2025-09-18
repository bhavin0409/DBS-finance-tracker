import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowDownRight, ArrowUpRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const AccountCard = ({ account }) => {
    const { name, type, balance, isDefault, id } = account;
    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-1 mb-2">
                    <CardTitle className="text-lg font-medium capitalize">{name}</CardTitle>
                    <Switch  checked={isDefault}/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold flex flex-row '>
                        <IndianRupee className='mt-1 mb-1.5'/>
                        <p>{parseFloat(balance).toFixed(2)}</p>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground mt-2">
                    <div className='flex items-center'>
                        <ArrowUpRight className='h-4 w-4 mr-2 text-green-500' />
                        Income
                    </div>
                    <div className='flex items-center'>
                        <ArrowDownRight className='h-4 w-4 mr-2 text-red-500' />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard