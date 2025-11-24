import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

   async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('produk_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('produks')
        .onDelete('CASCADE')
      table.enu('tipe', ['masuk', 'keluar']).notNullable()
      table.integer('jumlah').unsigned().notNullable()
      table.string('catatan').nullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}