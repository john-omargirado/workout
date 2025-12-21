import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')
  const isPublicApi = req.nextUrl.pathname.startsWith('/api/auth')

  // Allow public API routes
  if (isPublicApi) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect non-logged-in users to login (except for auth pages and public API)
  if (!isLoggedIn && !isAuthPage && !isApiRoute) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)']
}
