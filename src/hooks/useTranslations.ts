import { useT } from '@/providers/I18nProvider'
import type { Translations } from '@/i18n/translations/types'

export function useTranslations(): Translations {
  return useT()
}

export type { Translations }
