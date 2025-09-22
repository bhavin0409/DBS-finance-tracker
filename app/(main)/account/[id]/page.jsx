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
    <div>AccountPage</div>
  )
}

export default AccountPage