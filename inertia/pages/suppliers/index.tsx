import React, { useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface Supplier {
  id: number
  nama: string
  alamat: string
  telepon: string
  email: string
  created_at: string
  updated_at: string
  products: Array<{
    id: number
    nama: string
  }>
}

interface Props {
  suppliers: {
    data: Supplier[]
    meta: any
  }
}

export default function SuppliersIndex({ suppliers }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const { data, setData, post, put, processing, errors, reset } = useForm({
    nama: '',
    alamat: '',
    telepon: '',
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSupplier) {
    
      put(`/api/suppliers/${editingSupplier.id}`, {
        onSuccess: () => {
          setShowModal(false)
          setEditingSupplier(null)
          reset()
        }
      })
    } else {
   
      post('/api/suppliers', {
        onSuccess: () => {
          setShowModal(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (supplierId: number) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      router.delete(`/api/suppliers/${supplierId}`)
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setData({
      nama: supplier.nama,
      alamat: supplier.alamat || '',
      telepon: supplier.telepon || '',
      email: supplier.email || '',
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSupplier(null)
    reset()
  }

  return (
    <>
      <Head title="Suppliers" />
      <Layout title="Suppliers">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Supplier
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.data.map((supplier) => (
              <div key={supplier.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{supplier.nama}</h3>
                    {supplier.email && <p className="text-sm text-gray-500">{supplier.email}</p>}
                    {supplier.telepon && <p className="text-sm text-gray-500">{supplier.telepon}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {supplier.alamat && (
                    <div>
                      <span className="text-sm text-gray-500">Address:</span>
                      <p className="text-sm text-gray-900">{supplier.alamat}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {suppliers.data.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl">🏢</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new supplier.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Supplier
                </button>
              </div>
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
                      {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                          Supplier Name *
                        </label>
                        <input
                          type="text"
                          id="nama"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.nama}
                          onChange={(e) => setData('nama', e.target.value)}
                        />
                        {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                      </div>

                      <div>
                        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <textarea
                          id="alamat"
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.alamat}
                          onChange={(e) => setData('alamat', e.target.value)}
                        />
                        {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
                      </div>

                      <div>
                        <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="telepon"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.telepon}
                          onChange={(e) => setData('telepon', e.target.value)}
                        />
                        {errors.telepon && <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {processing ? (editingSupplier ? 'Updating...' : 'Adding...') : (editingSupplier ? 'Update Supplier' : 'Add Supplier')}
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
