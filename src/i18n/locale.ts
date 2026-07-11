import { defaultLocale, type Locale } from './config'

export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  return pathname || '/'
}
