import { getAccountWithTransactions } from '@/actions/account';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import TransactionTable from '../_components/transaction-table';

const AccountsPage = async ({params}) => {
    const resolvedParams = await params;  // Await params first
    const accountData = await getAccountWithTransactions(resolvedParams.id);

  //because of this below line the page is not rendering when account is not found)    
  // const accountData =  await getAccountWithTransactions(params.id);
     
  if(!accountData){
    notFound();
  }
  const { transections , ...account} = accountData; 
  
    return (
    <div className="space-y-8 px-5 "> 
    <div className="flex gap-4 items-center justify-between">

      <div >
        <h1 className="text-5xl sm:text-6xl font-bold  gradient-title capitalize">{
        account.name}</h1>
        <p className="text-muted-foreground">
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
      </div>

      <div className="text right pb-2">
        <div className="text-xl- sm:text-2xl font-bold">
          ₹{parseFloat(account.balance).toFixed(2)}</div>
        <p className="text-sm text-muted-foreground">
          {account._count.transections}Transactions</p>
      </div>
    </div> 
      
      {/*chart section*/}

      {/*transaction table*/}
    <Suspense fallback={<BarLoader className="mt 4" width={"100%"} color="#9333ea"/>}>
      <TransactionTable transactions={transections} />
    </Suspense>
    </div>
  );

};

export default AccountsPage;