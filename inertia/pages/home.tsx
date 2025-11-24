import { Head, Link } from '@inertiajs/react'

export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <span className="text-6xl">📦</span>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Inventaris Management System
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Manage your inventory efficiently and effectively
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Welcome to Inventaris
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Your complete solution for inventory management
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Admin Login
                </Link>
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Sistem inventaris untuk admin toko elektronik
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-lg font-medium text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-600">Real-time inventory overview and analytics</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <h3 className="text-lg font-medium text-gray-900">Product Management</h3>
                <p className="text-sm text-gray-600">Manage your products and categories</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📋</div>
                <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
                <p className="text-sm text-gray-600">Track stock in and out movements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}