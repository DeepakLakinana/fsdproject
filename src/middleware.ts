import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only home page ('/'), login ('/login'), static assets, and api routes are public
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('sahara_user')?.value

  // If user is already logged in and navigates to /login, redirect to /community
  if (userCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/community', request.url))
  }

  // If user is not logged in and tries to access protected pages (community, support, resources, about)
  const isPublicPage = pathname === '/' || pathname === '/login'
  const isInternalPath =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files like favicon, images

  if (!userCookie && !isPublicPage && !isInternalPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
