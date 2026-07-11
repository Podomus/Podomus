import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isLocale } from './i18n/config'

export function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  if (!cookieLocale) {
    const acceptLang = request.headers.get('Accept-Language') || ''
    const preferred = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase() || ''

    const detected = isLocale(preferred) ? preferred : defaultLocale
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', detected, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|css|js)).*)'],
}
