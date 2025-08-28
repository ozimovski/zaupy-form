import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zaupy Forms - Secure Whistleblowing Portal',
  description: 'Submit reports safely and confidentially through our secure platform.',
  keywords: ['whistleblowing', 'reporting', 'compliance', 'secure', 'confidential'],
  robots: 'noindex, nofollow', // Forms should not be indexed
  viewport: 'width=device-width, initial-scale=1',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get locale and messages with fallback
  let locale = 'sl'
  let messages
  
  try {
    locale = await getLocale()
  } catch (error) {
    console.error('Failed to get locale, using Slovenian:', error)
  }
  
  try {
    messages = await getMessages()
  } catch (error) {
    console.error('Failed to load messages, falling back to Slovenian:', error)
    // Fallback to Slovenian messages
    messages = (await import('../../messages/sl.json')).default
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        {/* Note: In development, Next.js uses eval for HMR; avoid strict CSP here. Add CSP via headers in production. */}
      </head>
      <body className={nunito.className}>
        <NextIntlClientProvider messages={messages as any} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
