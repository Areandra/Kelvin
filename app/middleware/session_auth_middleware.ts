import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SessionAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      const authToken = ctx.session.get('auth_token')
      const user = ctx.session.get('user')
      
      if (!authToken || !user) {
        const requestUrl = ctx.request.url()
        if (requestUrl.includes('/api/')) {
          return ctx.response.unauthorized({
            message: 'Unauthorized - Please login first'
          })
        }

        return ctx.response.redirect('/login')
      }
      
      ;(ctx as any).authUser = user
      
      const output = await next()
      return output
    } catch (error) {
      return ctx.response.redirect('/login')
    }
  }
}