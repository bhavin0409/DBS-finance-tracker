"use client";

import { updateDefaultAccount } from '@/actions/account';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/Hook/use-fetch';
import { ArrowDownRight, ArrowUpRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const AccountCard = ({ account }) => {
    const { name, type, balance, isDefault, id } = account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();

        if (isDefault) {
            toast.warning("you need at least one default account");
            return;
        }

        await updateDefaultFn(id);
    }

    useEffect(() => {
        if (updatedAccount?.success){
            toast.success("Default account successfully updated");
        }
    }, [updatedAccount, updateDefaultLoading])
    
    useEffect(() => {
        if (error){
            toast.error(error.message || "Failed to update default account");
        }
    }, [error])


    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-1 mb-2">
                    <CardTitle className="text-lg font-medium capitalize">{name}</CardTitle>
                    <Switch
                        checked={isDefault}
                        onClick={handleDefaultChange}
                        disabled={updateDefaultLoading}

                    />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold flex flex-row '>
                        <IndianRupee className='mt-1 mb-1.5' />
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