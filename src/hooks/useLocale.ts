'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { Locale } from '@/i18n'

export function useLocale() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const currentLocale = (searchParams.get('lang') as Locale) || 'sl'
  
  const setLocale = useCallback((locale: Locale) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set('lang', locale)
    const search = current.toString()
    const query = search ? `?${search}` : ''
    
    // Use window.location.href for immediate page reload with new locale
    window.location.href = `${pathname}${query}`
  }, [pathname, searchParams])
  
  return {
    currentLocale,
    setLocale
  }
}
