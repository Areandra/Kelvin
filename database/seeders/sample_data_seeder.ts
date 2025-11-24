import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/kategori'
import Product from '#models/produk'
import Transaction from '#models/transaction'

export default class extends BaseSeeder {
  async run() {
    const electronics = await Category.firstOrCreate(
      { nama: 'Electronics' },
      { nama: 'Electronics' }
    )
    
    const clothing = await Category.firstOrCreate(
      { nama: 'Clothing' },
      { nama: 'Clothing' }
    )
    
    const books = await Category.firstOrCreate(
      { nama: 'Books' },
      { nama: 'Books' }
    )
    

    const laptop = await Product.firstOrCreate(
      { nama: 'MacBook Pro' },
      {
        nama: 'MacBook Pro',
        merk: 'Apple',
        stok: 5,
        harga: 15000000,
        kategori_id: electronics.id
      }
    )
    
    const phone = await Product.firstOrCreate(
      { nama: 'iPhone 15' },
      {
        nama: 'iPhone 15',
        merk: 'Apple',
        stok: 10,
        harga: 8000000,
        kategori_id: electronics.id
      }
    )
    
    const tshirt = await Product.firstOrCreate(
      { nama: 'Cotton T-Shirt' },
      {
        nama: 'Cotton T-Shirt',
        merk: 'Uniqlo',
        stok: 25,
        harga: 150000,
        kategori_id: clothing.id
      }
    )
    
    const book = await Product.firstOrCreate(
      { nama: 'JavaScript Guide' },
      {
        nama: 'JavaScript Guide',
        merk: 'O\'Reilly',
        stok: 8,
        harga: 250000,
        kategori_id: books.id
      }
    )
    
    await Transaction.firstOrCreate(
      { 
        produk_id: laptop.id,
        tipe: 'masuk',
        jumlah: 5,
        catatan: 'Initial stock'
      },
      {
        produk_id: laptop.id,
        tipe: 'masuk',
        jumlah: 5,
        catatan: 'Initial stock'
      }
    )
    
    await Transaction.firstOrCreate(
      { 
        produk_id: phone.id,
        tipe: 'masuk',
        jumlah: 10,
        catatan: 'New shipment'
      },
      {
        produk_id: phone.id,
        tipe: 'masuk',
        jumlah: 10,
        catatan: 'New shipment'
      }
    )
    
    await Transaction.firstOrCreate(
      { 
        produk_id: tshirt.id,
        tipe: 'keluar',
        jumlah: 3,
        catatan: 'Customer purchase'
      },
      {
        produk_id: tshirt.id,
        tipe: 'keluar',
        jumlah: 3,
        catatan: 'Customer purchase'
      }
    )
    
    console.log('✅ Sample data created successfully!')
    console.log('📦 Categories: Electronics, Clothing, Books')
    console.log('🛍️  Products: MacBook Pro, iPhone 15, Cotton T-Shirt, JavaScript Guide')
    console.log('📋 Transactions: 3 sample transactions')
  }
}
