'use client'

import { useState } from 'react'
import { locales, type Locale } from '@/i18n'
import { useLocale } from '@/hooks/useLocale'
import { ChevronDown, Check } from 'lucide-react'

interface Language {
  code: Locale
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLocale, setLocale } = useLocale()
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  const handleLanguageChange = (locale: Locale) => {
    setLocale(locale)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Switch language"
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{currentLanguage.code}</span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                    currentLocale === language.code 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-sm">{language.flag}</span>
                  <span className="text-sm">{language.name}</span>
                  {currentLocale === language.code && (
                    <Check className="w-3 h-3 ml-auto text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
