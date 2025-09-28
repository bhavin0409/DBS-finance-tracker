import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import React from 'react'
import AddTransationForm from '../components/AddTransationForm'

const AddTransationPage = async () => {
  const accounts = await getUserAccounts()

  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradient-title mb-8'>Add Transaction</h1>

      <AddTransationForm accounts={accounts} categories={defaultCategories} />
    </div>
  )
}

export default AddTransationPage