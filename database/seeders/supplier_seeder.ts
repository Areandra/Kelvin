import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Supplier from '#models/supplier'

export default class extends BaseSeeder {
  async run() {

    const suppliersData = [
      {
        nama: 'PT. Tech Solutions Indonesia',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        telepon: '021-12345678',
        email: 'info@techsolutions.co.id'
      },
      {
        nama: 'CV. Fashion Store',
        alamat: 'Jl. Kemang Raya No. 456, Jakarta Selatan',
        telepon: '021-87654321',
        email: 'contact@fashionstore.com'
      },
      {
        nama: 'UD. Buku Mandiri',
        alamat: 'Jl. Gatot Subroto No. 789, Jakarta Pusat',
        telepon: '021-11223344',
        email: 'buku@mandiri.co.id'
      },
      {
        nama: 'PT. Electronics Pro',
        alamat: 'Jl. Thamrin No. 321, Jakarta Pusat',
        telepon: '021-99887766',
        email: 'sales@electronicspro.com'
      }
    ]


    const existingSuppliers = await Supplier.query().count('* as total')
    
    if (existingSuppliers[0].total === 0) {
      await Supplier.createMany(suppliersData)
      console.log('✅ Suppliers created successfully!')
      console.log('🏢 Sample suppliers added to database')
    } else {
      console.log('ℹ️  Suppliers already exist in database')
    }
  }
}
