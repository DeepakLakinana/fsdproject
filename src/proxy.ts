import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In Next.js 16, proxy replaces the legacy middleware convention
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('sahara_user')?.value

  // If user is not logged in and tries to access protected pages (community, support, resources, about, admin)
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)'],
}
