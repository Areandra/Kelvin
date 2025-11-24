import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  get hashedPassword() {
    return this.password
  }

  set hashedPassword(value: string) {
    this.password = hash.make(value)
  }

  generateToken(): string {
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email,
        fullName: this.fullName 
      },
      env.get('APP_KEY'),
      { expiresIn: '24h' }
    )
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.get('APP_KEY'))
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  static async verifyCredentials(email: string, password: string) {
    const user = await this.findBy('email', email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    return user
  }
}
