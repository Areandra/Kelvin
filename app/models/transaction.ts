import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Product from './produk.js'
import Supplier from './supplier.js'

export default class Transaction extends BaseModel {
  static table = 'transactions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipe: string

  @column()
  declare jumlah: number

  @column()
  declare catatan: string

  @column()
  declare produk_id: number

  @column()
  declare supplier_id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => Product, {
    foreignKey: 'produk_id'
  })
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Supplier, {
    foreignKey: 'supplier_id'
  })
  declare supplier: BelongsTo<typeof Supplier>
}
