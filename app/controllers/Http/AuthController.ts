import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'


export default class AuthController {
  async login({ request, response, session, inertia }: HttpContext) {
    try {
      const { password } = request.only(['password'])

      if (!password) {
        return inertia.render('login', {
          errors: { password: 'Password harus diisi' }
        })
      }

      const adminUser = await User.findBy('email', 'admin@inventaris.com')
      if (!adminUser) {
        return inertia.render('login', {
          errors: { password: 'Admin user tidak ditemukan. Silakan jalankan seeder terlebih dahulu.' }
        })
      }

      const isPasswordValid = await hash.verify(adminUser.password, password)
      if (!isPasswordValid) {
        return inertia.render('login', {
          errors: { password: 'Password salah' }
        })
      }

      const token = adminUser.generateToken()

      session.put('auth_token', token)
      session.put('user', {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email
      })

      return response.redirect('/dashboard')
    } catch (error) {
      return inertia.render('login', {
        errors: { password: 'Terjadi kesalahan saat login: ' + error.message }
      })
    }
  }
  async logout({ session, response }: HttpContext) {
    try {
      session.forget('auth_token')
      session.forget('user')
      
      return response.redirect('/login')
    } catch (error) {
      return response.redirect('/login')
    }
  }
  async profile({ session, response }: HttpContext) {
    try {
      const user = session.get('user')
      
      if (!user) {
        return response.unauthorized({
          message: 'User tidak ditemukan'
        })
      }
      
      return response.ok({
        user: user
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Terjadi kesalahan saat mengambil profil',
        error: error.message
      })
    }
  }
  async refresh({ session, response }: HttpContext) {
    try {
      const user = session.get('user')
      
      if (!user) {
        return response.unauthorized({
          message: 'User tidak ditemukan'
        })
      }
      
      const adminUser = await User.findBy('email', user.email)
      if (!adminUser) {
        return response.unauthorized({
          message: 'User tidak ditemukan'
        })
      }
      
      const token = adminUser.generateToken()
      
      session.put('auth_token', token)
      
      return response.ok({
        message: 'Token berhasil diperbarui',
        token: token
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Terjadi kesalahan saat memperbarui token',
        error: error.message
      })
    }
  }
}
