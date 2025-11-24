import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface Transaction {
  id: number
  produk_id: number
  tipe: 'masuk' | 'keluar'
  jumlah: number
  catatan?: string
  supplier_id?: number
  created_at: string
  updated_at: string
  product: {
    id: number
    nama: string
    merk?: string
  }
  supplier?: {
    id: number
    nama: string
    alamat: string
    telepon: string
    email: string
  }
}

interface Product {
  id: number
  nama: string
  merk?: string
}

interface Supplier {
  id: number
  nama: string
  alamat: string
  telepon: string
  email: string
}

interface Props {
  transactions: {
    data: Transaction[]
    meta: any
  }
  products: Product[]
  suppliers: Supplier[]
}

export default function TransactionsIndex({ transactions, products, suppliers }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [typeFilter, setTypeFilter] = useState<'all' | 'masuk' | 'keluar'>('all')
  const { data, setData, post, put, processing, errors, reset } = useForm({
    produk_id: '',
    tipe: 'masuk' as 'masuk' | 'keluar',
    jumlah: 0,
    catatan: '',
    supplier_id: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTransaction) {
    
      console.log('Updating transaction:', editingTransaction.id, 'with data:', data)
      put(`/api/transactions/${editingTransaction.id}`, {
        onSuccess: () => {
          console.log('Transaction updated successfully')
          setShowModal(false)
          setEditingTransaction(null)
          reset()
        },
        onError: (errors) => {
          console.error('Update errors:', errors)
        }
      })
    } else {
    
      console.log('Creating new transaction with data:', data)
      post('/api/transactions', {
        onSuccess: () => {
          console.log('Transaction created successfully')
          setShowModal(false)
          reset()
        },
        onError: (errors) => {
          console.error('Create errors:', errors)
        }
      })
    }
  }

  const handleDelete = (transactionId: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      router.delete(`/api/transactions/${transactionId}`)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    console.log('Editing transaction:', transaction)
    setEditingTransaction(transaction)
    setData({
      produk_id: transaction.produk_id.toString(),
      tipe: transaction.tipe,
      jumlah: transaction.jumlah,
      catatan: transaction.catatan || '',
      supplier_id: transaction.supplier_id?.toString() || '',
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTransaction(null)
    reset()
  }

  const filteredTransactions = transactions.data.filter(transaction => {
    if (typeFilter === 'all') return true
    return transaction.tipe === typeFilter
  })

  return (
    <>
      <Head title="Transactions" />
      <Layout title="Transactions">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Transaction
            </button>
          </div>

          <div className="flex space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'masuk' | 'keluar')}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Transactions</option>
              <option value="masuk">Stock In</option>
              <option value="keluar">Stock Out</option>
            </select>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <li key={transaction.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.tipe === 'masuk' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.tipe}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.product.nama}
                            {transaction.product.merk && ` (${transaction.product.merk})`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {transaction.jumlah}
                          </p>
                          {transaction.supplier && (
                            <p className="text-sm text-gray-500">
                              Supplier: {transaction.supplier.nama}
                            </p>
                          )}
                          {transaction.catatan && (
                            <p className="text-sm text-gray-500">
                              Note: {transaction.catatan}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Created: {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('id-ID') : 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Updated: {transaction.updated_at ? new Date(transaction.updated_at).toLocaleDateString('id-ID') : 'Unknown'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl">📋</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {typeFilter !== 'all' ? 'No transactions of this type.' : 'Get started by recording a new transaction.'}
              </p>
              {typeFilter === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add Transaction
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="produk_id" className="block text-sm font-medium text-gray-700">
                          Product *
                        </label>
                        <select
                          id="produk_id"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.produk_id}
                          onChange={(e) => setData('produk_id', e.target.value)}
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.nama} {product.merk && `(${product.merk})`}
                            </option>
                          ))}
                        </select>
                        {errors.produk_id && <p className="text-red-500 text-sm mt-1">{errors.produk_id}</p>}
                      </div>

                      <div>
                        <label htmlFor="tipe" className="block text-sm font-medium text-gray-700">
                          Transaction Type *
                        </label>
                        <select
                          id="tipe"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.tipe}
                          onChange={(e) => setData('tipe', e.target.value as 'masuk' | 'keluar')}
                        >
                          <option value="masuk">Stock In (Masuk)</option>
                          <option value="keluar">Stock Out (Keluar)</option>
                        </select>
                        {errors.tipe && <p className="text-red-500 text-sm mt-1">{errors.tipe}</p>}
                      </div>

                      <div>
                        <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">
                          Supplier
                        </label>
                        <select
                          id="supplier_id"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.supplier_id}
                          onChange={(e) => setData('supplier_id', e.target.value)}
                        >
                          <option value="">Pilih Supplier</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.nama}
                            </option>
                          ))}
                        </select>
                        {errors.supplier_id && <p className="text-red-500 text-sm mt-1">{errors.supplier_id}</p>}
                      </div>

                      <div>
                        <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          id="jumlah"
                          min="1"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.jumlah}
                          onChange={(e) => setData('jumlah', parseInt(e.target.value) || 0)}
                        />
                        {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
                      </div>

                      <div>
                        <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="catatan"
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.catatan}
                          onChange={(e) => setData('catatan', e.target.value)}
                        />
                        {errors.catatan && <p className="text-red-500 text-sm mt-1">{errors.catatan}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {processing ? (editingTransaction ? 'Updating...' : 'Adding...') : (editingTransaction ? 'Update Transaction' : 'Add Transaction')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
