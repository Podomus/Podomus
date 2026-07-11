import type { Translations } from './types'
import fr from './fr'
import en from './en'
import type { Locale } from '../config'

const translations: Record<Locale, Translations> = { fr, en }

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export type { Translations }
