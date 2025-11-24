import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from './produk.js'

export default class Category extends BaseModel {
  static table = 'kategoris'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @hasMany(() => Product, {
    foreignKey: 'kategori_id'
  })
  declare products: HasMany<typeof Product>
}
