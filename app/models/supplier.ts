import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from './produk.js'

export default class Supplier extends BaseModel {
  static table = 'suppliers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @column()
  declare alamat: string

  @column()
  declare telepon: string

  @column()
  declare email: string

  @hasMany(() => Product, {
    foreignKey: 'supplier_id'
  })
  declare products: HasMany<typeof Product>
}
