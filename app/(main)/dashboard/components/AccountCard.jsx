"use client";

import { updateDefaultAccount } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/Hook/use-fetch';
import { ArrowDownRight, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const AccountCard = ({ account }) => {
    const { name, type, balance, isDefault, id } = account;
    const [showBalance, setShowBalance] = useState(false);

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
        if (updatedAccount?.success) {
            toast.success("Default account successfully updated");
        }
    }, [updatedAccount, updateDefaultLoading])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account");
        }
    }, [error])


    return (
        <Card className="hover:shadow-lg transition-shadow group relative">
            <Link href={`/account/${id}`} className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-1 mb-2">
                    <CardTitle className="text-lg font-medium capitalize">{name}</CardTitle>

                    <Switch
                        checked={isDefault}
                        onClick={handleDefaultChange}
                        disabled={updateDefaultLoading}
                    />
                </CardHeader>
            </Link>
            <CardContent>
                <div className="flex items-center justify-between">
                    <Link href={`/account/${id}`} className="w-full">
                        <p className="font-semibold text-2xl">
                            {showBalance ? new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                            }).format(parseFloat(balance)) : "₹ ****"}
                        </p>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                </div>
                <Link href={`/account/${id}`} className="w-full">
                    <p className='text-sm text-muted-foreground'>
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                </Link>
            </CardContent>
            <Link href={`/account/${id}`}>
                <CardFooter className="flex justify-between text-sm text-muted-foreground mt-2 cursor-pointer">
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