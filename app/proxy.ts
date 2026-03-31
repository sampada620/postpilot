import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/create', '/calendar', '/analytics', '/settings']

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtected) {
    const token =
      req.cookies.get('next-auth.session-token') ||
      req.cookies.get('__Secure-next-auth.session-token')

    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/calendar/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}