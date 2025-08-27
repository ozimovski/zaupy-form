import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Add the full URL to headers so i18n can access it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-url', request.url)
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
