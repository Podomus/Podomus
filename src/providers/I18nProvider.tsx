'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Translations } from '@/i18n/translations/types'

const I18nContext = createContext<Translations | null>(null)

export function I18nProvider({
  translations,
  children,
}: {
  translations: Translations
  children: React.ReactNode
}) {
  return (
    <I18nContext.Provider value={translations}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT(): Translations {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used within I18nProvider')
  return ctx
}
