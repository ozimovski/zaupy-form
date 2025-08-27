'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Menu, X, Shield, FileText, Search, HelpCircle, ArrowRight } from 'lucide-react'
import type { BrandingConfig } from '@/types'

interface HeaderProps {
  branding: BrandingConfig
}

export function Header({ branding }: HeaderProps) {
  const t = useTranslations()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Generate initials from company name for fallback logo
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo Section - Optimized for mobile */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity min-w-0 flex-1">
              <div className="flex-shrink-0 relative">
                {branding.logo ? (
                  <>
                    <Image
                      src={branding.logo}
                      alt={`${branding.name} logo`}
                      width={32}
                      height={32}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) {
                          fallback.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-600 flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {getInitials(branding.name)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {getInitials(branding.name)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                  {branding.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {t('header.portal')}
                </p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/form" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {t('navigation.submitReport.title')}
              </Link>
              <Link href="/track" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {t('navigation.trackReport.title')}
              </Link>
              <Link href="/questions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {t('navigation.faq.title')}
              </Link>
              <div className="text-sm text-gray-500 border-l border-gray-300 pl-6 flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>{t('navigation.secureConfidential')}</span>
              </div>
            </nav>
            
            {/* Right side controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop with blur effect */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Slide-out Menu Panel */}
        <div className={`fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Menu</h3>
                <p className="text-xs text-gray-500">{t('navigation.secureConfidential')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6 space-y-2">
            <Link 
              href="/form" 
              className="group flex items-center p-4 rounded-xl hover:bg-primary-50 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {t('navigation.submitReport.title')}
                  </div>
                  <div className="text-sm text-gray-500 leading-tight">
                    {t('navigation.submitReport.description')}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
            
            <Link 
              href="/track" 
              className="group flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {t('navigation.trackReport.title')}
                  </div>
                  <div className="text-sm text-gray-500 leading-tight">
                    {t('navigation.trackReport.description')}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
              </div>
            </Link>
            
            <Link 
              href="/questions" 
              className="group flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {t('navigation.faq.title')}
                  </div>
                  <div className="text-sm text-gray-500 leading-tight">
                    {t('navigation.faq.description')}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
              </div>
            </Link>
          </nav>

          {/* Footer with Security Badge */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{t('navigation.mobileMenu.securityTitle')}</div>
                <div className="text-xs text-gray-500">{t('navigation.mobileMenu.securityDescription')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
