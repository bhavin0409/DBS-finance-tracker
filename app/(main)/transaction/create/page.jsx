import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import React from 'react'
import AddTransationForm from '../components/AddTransationForm'
import { getTransation } from '@/actions/transaction'

const AddTransationPage = async ({ searchParams }) => {
  const accounts = await getUserAccounts()
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransation(editId);
    initialData = transaction;
  }

  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradient-title mb-8'>{editId ? "Update Transaction" : "Add Transaction"}</h1>

      <AddTransationForm 
        accounts={accounts} 
        categories={defaultCategories}
        initialData={initialData}
        editMode={!!editId}
      />
    </div>
  )
}

export default AddTransationPage