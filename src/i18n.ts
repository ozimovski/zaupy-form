import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

export const locales = ['sl', 'en'] as const
export type Locale = typeof locales[number]

export default getRequestConfig(async () => {
  // Default to Slovenian
  let locale: Locale = 'sl'
  
  try {
    // Get locale from current request URL or referer
    const headersList = headers()
    const referer = headersList.get('referer')
    const url = headersList.get('x-url') || referer
    
    if (url) {
      const urlObj = new URL(url)
      const urlLocale = urlObj.searchParams.get('lang') as Locale
      if (urlLocale && locales.includes(urlLocale)) {
        locale = urlLocale
      }
    }
  } catch (error) {
    // Fallback to default locale if there's any error
    console.log('Locale detection error, falling back to Slovenian:', error)
    locale = 'sl'
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
