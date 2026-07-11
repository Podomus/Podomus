import { cookies } from 'next/headers'
import { defaultLocale, isLocale, type Locale } from './config'
import { getTranslations } from './translations'
import type { Translations } from './translations/types'

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const val = cookieStore.get('NEXT_LOCALE')?.value
  if (val && isLocale(val)) return val
  return defaultLocale
}

export async function getServerTranslations(): Promise<Translations> {
  const locale = await getServerLocale()
  return getTranslations(locale)
}
