import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produks'

   async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama').notNullable()
      table.string('merk').nullable()
      table.integer('stok').unsigned().defaultTo(0)
      table.decimal('harga', 10, 2).notNullable()
      table
        .integer('kategori_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('kategoris')
        .onDelete('CASCADE')
        
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}