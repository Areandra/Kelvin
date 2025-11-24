import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface Product {
  id: number
  nama: string
  merk: string
  stok: number
  harga: number
  kategori_id?: number
  category: {
    id: number
    nama: string
  }
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  nama: string
}

interface Props {
  products: {
    data: Product[]
    meta: any
  }
  categories: Category[]
}

export default function ProductsIndex({ products, categories }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data, setData, post, put, processing, errors, reset } = useForm({
    nama: '',
    merk: '',
    stok: 0,
    harga: 0,
    kategori_id: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted. Data:', data)
    console.log('Editing product:', editingProduct)

    if (editingProduct) {
   
      console.log('Updating product:', editingProduct.id)
      put(`/api/products/${editingProduct.id}`, {
        onSuccess: () => {
          console.log('Product updated successfully')
          setShowModal(false)
          setEditingProduct(null)
          reset()
        }
      })
    } else {
   
      console.log('Creating new product')
      post('/api/products', {
        onSuccess: () => {
          console.log('Product created successfully')
          setShowModal(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(`/api/products/${productId}`)
    }
  }

  const handleEdit = (product: Product) => {
    console.log('Edit button clicked for product:', product)
    setEditingProduct(product)
    
   
    reset()
    
 
    setData({
      nama: product.nama,
      merk: product.merk || '',
      stok: product.stok,
      harga: product.harga,
      kategori_id: (product.kategori_id ?? product.category?.id ?? '').toString(),
    })
    
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    reset()
  }

  const filteredProducts = products.data.filter(product =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.merk?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Head title="Products" />
      <Layout title="Products">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Product
            </button>
          </div>

          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{product.nama}</h3>
                    {product.merk && <p className="text-sm text-gray-500">{product.merk}</p>}
                    <p className="text-sm text-indigo-600">{product.category.nama}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span className={`text-sm font-medium ${
                      product.stok < 10 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.stok}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rp {Number(product.harga).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl">📦</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new product.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add Product
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
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                          Product Name *
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
                        <label htmlFor="merk" className="block text-sm font-medium text-gray-700">
                          Brand
                        </label>
                        <input
                          type="text"
                          id="merk"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.merk}
                          onChange={(e) => setData('merk', e.target.value)}
                        />
                        {errors.merk && <p className="text-red-500 text-sm mt-1">{errors.merk}</p>}
                      </div>

                      <div>
                        <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700">
                          Category *
                        </label>
                        <select
                          id="kategori_id"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.kategori_id}
                          onChange={(e) => setData('kategori_id', e.target.value)}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.nama}
                            </option>
                          ))}
                        </select>
                        {errors.kategori_id && <p className="text-red-500 text-sm mt-1">{errors.kategori_id}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="stok" className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <input
                            type="number"
                            id="stok"
                            min="0"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={data.stok}
                            onChange={(e) => setData('stok', parseInt(e.target.value) || 0)}
                          />
                          {errors.stok && <p className="text-red-500 text-sm mt-1">{errors.stok}</p>}
                        </div>

                        <div>
                          <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                            Price (Rp) *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">Rp</span>
                            </div>
                            <input
                              type="text"
                              id="harga"
                              placeholder="Contoh: 1.500.000"
                              className="mt-1 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={data.harga ? Number(data.harga).toLocaleString('id-ID') : ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\./g, '')
                                setData('harga', parseInt(value) || 0)
                              }}
                            />
                          </div>
                          {errors.harga && <p className="text-red-500 text-sm mt-1">{errors.harga}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {processing ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
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
