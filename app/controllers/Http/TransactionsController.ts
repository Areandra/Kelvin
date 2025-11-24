import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import Product from '#models/produk'
import Supplier from '#models/supplier'

export default class TransactionsController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const type = request.input('type')
    
    let query = Transaction.query().preload('product').preload('supplier')
    
    if (type && ['masuk', 'keluar'].includes(type)) {
      query = query.where('tipe', type)
    }
    
    return await query.paginate(page, limit)
  }

  async store({ request }: HttpContext) {
    const data = request.only(['produk_id', 'tipe', 'jumlah', 'catatan', 'supplier_id'])

    if (!data.produk_id || !data.tipe || !data.jumlah) {
      return { error: 'Produk ID, tipe, dan jumlah harus diisi' }
    }

    if (!['masuk', 'keluar'].includes(data.tipe)) {
      return { error: 'Tipe harus berupa "masuk" atau "keluar"' }
    }

    const product = await Product.findOrFail(data.produk_id)

    if (data.tipe === 'keluar' && product.stok < data.jumlah) {
      return { error: 'Stok tidak mencukupi' }
    }

    const transaction = await Transaction.create(data)
    await transaction.load('product')
    await transaction.load('supplier')
    
    if (data.tipe === 'masuk') {
      product.stok += data.jumlah
    } else {
      product.stok -= data.jumlah
    }
    await product.save()
    
    return transaction
  }

  async show({ params }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('product')
      .preload('supplier')
      .firstOrFail()
    
    return transaction
  }

  async update({ params, request }: HttpContext) {
    try {
      console.log('Update transaction request:', request.all())
      
      const transaction = await Transaction.findOrFail(params.id)
      console.log('Found transaction:', transaction.toJSON())
      
      const data = request.only(['produk_id', 'tipe', 'jumlah', 'catatan', 'supplier_id'])
      console.log('Update data:', data)

      if (!data.produk_id || !data.tipe || !data.jumlah) {
        return { error: 'Produk ID, tipe, dan jumlah harus diisi' }
      }

      if (!['masuk', 'keluar'].includes(data.tipe)) {
        return { error: 'Tipe harus berupa "masuk" atau "keluar"' }
      }

      const product = await Product.findOrFail(data.produk_id)

      if (data.tipe === 'keluar' && product.stok < data.jumlah) {
        return { error: 'Stok tidak mencukupi' }
      }

      transaction.merge(data)
      await transaction.save()
      await transaction.load('product')
      
      console.log('Transaction updated successfully:', transaction.toJSON())
      return transaction
    } catch (error) {
      console.error('Update transaction error:', error)
      return { error: 'Terjadi kesalahan saat mengupdate transaksi' }
    }
  }

  async destroy({ params }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)
    const product = await transaction.related('product').query().firstOrFail()

    if (transaction.tipe === 'masuk') {
      product.stok -= transaction.jumlah
    } else {
      product.stok += transaction.jumlah
    }
    await product.save()
    
    await transaction.delete()
    return { message: 'Transaksi berhasil dihapus' }
  }

  async getByProduct({ params }: HttpContext) {
    const transactions = await Transaction.query()
      .where('produk_id', params.productId)
      .preload('product')
      .orderBy('created_at', 'desc')
    
    return transactions
  }

  async stats({ request }: HttpContext) {
    const dateFrom = request.input('dateFrom')
    const dateTo = request.input('dateTo')
    
    let query = Transaction.query()
    
    if (dateFrom) {
      query = query.where('created_at', '>=', dateFrom)
    }
    
    if (dateTo) {
      query = query.where('created_at', '<=', dateTo)
    }
    
    const transactions = await query.preload('product')
    
    const masukCount = transactions.filter(t => t.tipe === 'masuk').length
    const keluarCount = transactions.filter(t => t.tipe === 'keluar').length
    const totalMasuk = transactions
      .filter(t => t.tipe === 'masuk')
      .reduce((sum, t) => sum + t.jumlah, 0)
    const totalKeluar = transactions
      .filter(t => t.tipe === 'keluar')
      .reduce((sum, t) => sum + t.jumlah, 0)
    
    return {
      totalTransactions: transactions.length,
      masukCount,
      keluarCount,
      totalMasuk,
      totalKeluar,
      netChange: totalMasuk - totalKeluar
    }
  }

  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Transaction.query()
      .whereHas('product', (productQuery) => {
        productQuery.where('nama', 'like', `%${searchTerm}%`)
      })
      .orWhere('catatan', 'like', `%${searchTerm}%`)
      .preload('product')
      .paginate(page, limit)
  }
}
