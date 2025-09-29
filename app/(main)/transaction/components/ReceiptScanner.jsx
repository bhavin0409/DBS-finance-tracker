"use client"

import { scanReceipt } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import useFetch from '@/Hook/use-fetch';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const ReceiptScanner = ({ onScanComplete }) => {
    const fileRef = useRef();
    const {
        loading: scanLoading,
        fn: scanFn,
        data: scanData
    } = useFetch(scanReceipt)

    const handleReceiptScan = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB")
            return
        }

        await scanFn(file)
    }

    useEffect(() => {
        if (scanData && !scanLoading) {
            onScanComplete(scanData)
            toast.success("Receipt scanned successfully")
        }
    }, [scanLoading , scanData])
    

    return (
        <div>
            <Input 
                type='file'
                ref={fileRef}
                className="hidden"
                accept="image/*"
                capture="enviorement"
                onChange = {(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleReceiptScan(file)
                    }
                }}
            />
            <Button 
                type="button"
                variant='outline'
                onClick={() => fileRef.current?.click()}
                className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
                disabled={scanLoading}
            >
                {scanLoading ? 
                (
                    <>
                        <Loader2 className='mr-2 animate-spin'></Loader2>
                        <span>Scanning Receipt...</span>
                    </> 
                ):(
                    <>
                        <Camera className='mr-2'/>
                        <span>Scan Receipt With AI</span>
                    </>
                )}
            </Button>
        </div>
    )
}

export default ReceiptScanner