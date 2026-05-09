import { NextRequest, NextResponse } from 'next/server'
import { validateToken, refreshAccessToken } from './lib/auth'

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value
  const url = req.nextUrl.clone()
  const loginPath = process.env.NEXT_PUBLIC_LOGIN_PATH || '/login'
  const homepagePath = process.env.NEXT_PUBLIC_HOME_PATH || '/dashboard'
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/auth']
  const isProtected = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  )
  const isAuth = authRoutes.some((route) => url.pathname.startsWith(route))
  // Redirect protected routes to login if not authenticated

  if (isProtected) {
    const valid = await validateToken(accessToken)
    if (!valid && refreshToken) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL(loginPath, req.url))
      }
    } else if (!valid) {
      return NextResponse.redirect(new URL(loginPath, req.url))
    }
  }

  // Redirect auth to dashboard if authenticated
  if (isAuth) {
    const valid = await validateToken(accessToken)
    if (valid) {
      return NextResponse.redirect(new URL(homepagePath, req.url))
    }
  }

  // Redirect root to dashboard if authenticated
  if (url.pathname === '/') {
    return NextResponse.redirect(new URL(homepagePath, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
