import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
  
    const existingAdmin = await User.findBy('email', 'admin@inventaris.com')
    
    if (!existingAdmin) {
 
      await User.create({
        fullName: 'Administrator',
        email: 'admin@inventaris.com',
        password: await hash.make('admin123')
      })
      
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email: admin@inventaris.com')
      console.log('🔑 Password: admin123')
    } else {
      console.log('ℹ️  Admin user already exists')
    }
  }
}