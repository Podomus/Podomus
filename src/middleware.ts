import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isLocale } from './i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)

  const hasEnPrefix = segments[0] === 'en'
  const locale = hasEnPrefix ? 'en' : defaultLocale

  if (hasEnPrefix) {
    const newPath = '/' + segments.slice(1).join('/')
    const url = new URL(newPath || '/', request.url)
    const response = NextResponse.rewrite(url)
    response.cookies.set('NEXT_LOCALE', 'en', {
      path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax',
    })
    return response
  }

  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', defaultLocale, {
    path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax',
  })
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|css|js)).*)'],
}
