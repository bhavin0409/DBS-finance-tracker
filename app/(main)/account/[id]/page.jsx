import { Suspense } from 'react'
import TransactionTable from '../_components/transaction-table'
import { getAccountWithTransactions } from '@/actions/account'
import { notFound } from 'next/navigation';
import { IndianRupee } from 'lucide-react';
import { BarLoader } from 'react-spinners';

const AccountPage = async ({ params }) => {
  const accountId = params.id;

  const accountData = await getAccountWithTransactions(accountId);
  if (!accountData) {
    notFound()
  }

  const { transactions, ...account } = accountData;
  return (
    <div>


      <div className='space-y-8 px-5 flex gap-4 items-center justify-between'>
        <div>
          <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>{account.name}</h1>
          <p className='text-muted-foreground'>{account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account</p>
        </div>

        <div className='text-right pb-2'>
          <div className='flex flex-row text-xl sm:text-2xl font-bold'><IndianRupee size={23} className='mt-1' />{parseFloat(account.balance).toFixed(2)}</div>
          <p className='text-sm text-muted-foreground'>{account._count.transactions} Transactions</p>
        </div>
      </div>

      {/* chart section */}

      {/* transaction table */}
      <Suspense fallback={<BarLoader className='mt-4' width={'100%'} color='#36d7b7' />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  )
}

export default AccountPage