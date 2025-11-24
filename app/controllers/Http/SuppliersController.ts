import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'

export default class SuppliersController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    return await Supplier.query()
      .preload('products')
      .paginate(page, limit)
  }

  async store({ request }: HttpContext) {
    const data = request.only(['nama', 'alamat', 'telepon', 'email'])

    if (!data.nama) {
      return { error: 'Nama supplier harus diisi' }
    }

    const supplier = await Supplier.create(data)
    return supplier
  }

  async show({ params }: HttpContext) {
    const supplier = await Supplier.query()
      .where('id', params.id)
      .preload('products')
      .firstOrFail()
    
    return supplier
  }

  async update({ params, request }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    const data = request.only(['nama', 'alamat', 'telepon', 'email'])
    
    supplier.merge(data)
    await supplier.save()
    
    return supplier
  }

  async destroy({ params }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    const productCount = await supplier.related('products').query().count('* as total')
    if (productCount[0].total > 0) {
      return { error: 'Tidak dapat menghapus supplier yang masih memiliki produk' }
    }
    await supplier.delete()
    return { message: 'Supplier berhasil dihapus' }
  }
  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Supplier.query()
      .where('nama', 'like', `%${searchTerm}%`)
      .preload('products')
      .paginate(page, limit)
  }
}