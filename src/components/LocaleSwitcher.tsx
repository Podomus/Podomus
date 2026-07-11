'use client'

import { useCallback } from 'react'
import { useT } from '@/providers/I18nProvider'
import { locales, defaultLocale } from '@/i18n/config'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match?.[2]
}

export function LocaleSwitcher() {
  const current = getCookie('NEXT_LOCALE') || defaultLocale
  const next = locales.find((l) => l !== current) || defaultLocale

  const switchLocale = useCallback(() => {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    window.location.reload()
  }, [next])

  const label = next === 'en' ? 'English' : 'Français'

  return (
    <button
      onClick={switchLocale}
      className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-softtail-500 transition-colors duration-200"
      aria-label={`Switch language to ${label}`}
    >
      {next === 'en' ? 'EN' : 'FR'}
    </button>
  )
}
