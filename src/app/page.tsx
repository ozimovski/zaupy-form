'use client'

import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FileText, List, HelpCircle, ArrowRight, Shield, Clock } from 'lucide-react'
import { DEFAULT_SUBDOMAIN } from '@/lib/constants'

export default function HomePage() {
  const t = useTranslations()
  const { config, loading, error, refetch } = useFormConfig(DEFAULT_SUBDOMAIN)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <Alert variant="error" title="Configuration Error">
            <div className="space-y-3">
              <p>{error || 'Unable to load company configuration.'}</p>
              <button
                onClick={refetch}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <ConfigProvider config={config} loading={loading} error={error}>
      <ThemeProvider config={config}>
                <PageLayout config={config}>
          <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                  {config.branding.name}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                  {config.content.welcomeSubtitle}
                </p>
                
                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                  <Link 
                    href="/form" 
                    className="inline-flex items-center justify-center bg-primary-600 text-white hover:bg-primary-700 shadow-lg text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('home.submitReport.title')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Link>
                  
                  <Link 
                    href="/track" 
                    className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('home.trackReport.title')}
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    <span className="text-sm font-medium">{t('home.hero.secureConfidential')}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    <span className="text-sm font-medium">{t('home.hero.available247')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {t('home.hero.howItWorks')}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('home.hero.howItWorksSubtitle')}
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
                {/* Submit Report */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                  <CardContent className="p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary-700 transition-colors duration-300">
                      <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{t('home.submitReport.title')}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-grow">
                      {t('home.submitReport.description')}
                    </p>
                    <Link 
                      href="/form" 
                      className="w-full inline-flex items-center justify-center bg-primary-600 text-white hover:bg-primary-700 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors group-hover:bg-primary-700 mt-auto"
                    >
                      {t('home.submitReport.title')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Track Report */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                  <CardContent className="p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary-700 transition-colors duration-300">
                      <List className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{t('home.trackReport.title')}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-grow">
                      {t('home.trackReport.description')}
                    </p>
                    <Link 
                      href="/track" 
                      className="w-full inline-flex items-center justify-center border border-primary-200 text-primary-600 hover:bg-primary-50 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors mt-auto"
                    >
                      {t('home.trackReport.title')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Questions/FAQ */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                  <CardContent className="p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary-700 transition-colors duration-300">
                      <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{t('home.questions.title')}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-grow">
                      {t('home.questions.description')}
                    </p>
                    <Link 
                      href="/questions" 
                      className="w-full inline-flex items-center justify-center border border-primary-200 text-primary-600 hover:bg-primary-50 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors mt-auto"
                    >
                      {t('navigation.faq.title')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom CTA Section */}
              <div className="bg-primary-50 rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {t('home.hero.readyToMakeDifference')}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  {t('home.hero.yourVoiceMatters')}
                </p>
                <Link 
                  href="/form" 
                  className="inline-flex items-center bg-primary-600 text-white hover:bg-primary-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('home.submitReport.title')}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
                <p className="text-sm sm:text-base text-gray-500 mb-2">
                  {config.content.footerText}
                </p>
                {config.content.contactEmail && (
                  <p className="text-sm sm:text-base text-gray-500">
                    {t('home.footer.contact')} 
                    <a 
                      href={`mailto:${config.content.contactEmail}`} 
                      className="text-primary-600 hover:text-primary-700 font-medium ml-1"
                    >
                      {config.content.contactEmail}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}
