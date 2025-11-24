import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/kategori'

export default class CategoriesController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    return await Category.query()
      .preload('products')
      .paginate(page, limit)
  }

  async store({ request }: HttpContext) {
    const data = request.only(['nama'])

    if (!data.nama) {
      return { error: 'Nama kategori harus diisi' }
    }

    const category = await Category.create(data)
    return category
  }

  async show({ params }: HttpContext) {
    const category = await Category.query()
      .where('id', params.id)
      .preload('products')
      .firstOrFail()
    
    return category
  }

  async update({ params, request }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const data = request.only(['nama'])
    
    category.merge(data)
    await category.save()
    
    return category
  }

  async destroy({ params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const productCount = await category.related('products').query().count('* as total')
    if (productCount[0].total > 0) {
      return { error: 'Tidak dapat menghapus kategori yang masih memiliki produk' }
    }
    await category.delete()
    return { message: 'Kategori berhasil dihapus' }
  }
  async stats({ params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const products = await category.related('products').query()
    
    const totalProducts = products.length
    const totalStock = products.reduce((sum, product) => sum + product.stok, 0)
    const averagePrice = products.length > 0 
      ? products.reduce((sum, product) => sum + product.harga, 0) / products.length 
      : 0
    
    return {
      category: category,
      stats: {
        totalProducts,
        totalStock,
        averagePrice: Math.round(averagePrice * 100) / 100
      }
    }
  }

  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Category.query()
      .where('nama', 'like', `%${searchTerm}%`)
      .preload('products')
      .paginate(page, limit)
  }
}
