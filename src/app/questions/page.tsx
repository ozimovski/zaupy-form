'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DEFAULT_SUBDOMAIN } from '@/lib/constants'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  MessageSquare, 
  Mail,
  Shield,
  Settings,
  Monitor
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'privacy' | 'process' | 'technical'
}

export default function QuestionsPage() {
  const t = useTranslations()
  const { config, loading, error, refetch } = useFormConfig(DEFAULT_SUBDOMAIN)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Get FAQs from translations
  const faqs: FAQItem[] = t.raw('questions.faqs') || []
  
  // Categories with translated names
  const categories = {
    general: { name: t('questions.categories.general'), icon: HelpCircle },
    privacy: { name: t('questions.categories.privacy'), icon: Shield },
    process: { name: t('questions.categories.process'), icon: Settings },
    technical: { name: t('questions.categories.technical'), icon: Monitor }
  }

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    const id = index.toString()
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Alert variant="error" title={t('errors.configError')}>
          <div className="space-y-3">
            <p>{error || t('errors.configErrorDescription')}</p>
            <button
              onClick={refetch}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        </Alert>
      </div>
    )
  }

  return (
    <ConfigProvider config={config} loading={loading} error={error}>
      <ThemeProvider config={config}>
        <PageLayout config={config}>
          <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                  <HelpCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-3">{t('questions.title')}</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('questions.subtitle')}
                </p>
              </div>

              {/* Search and Filters */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t('questions.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="all">{t('questions.categories.all')}</option>
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      selectedCategory === 'all' 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
{t('questions.categories.all')}
                  </button>
                  {Object.entries(categories).map(([key, category]) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                          selectedCategory === key 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2 inline" />
                        {category.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFaqs.length === 0 ? (
                  <Card className="border border-gray-200">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('questions.noResults.title')}</h3>
                      <p className="text-gray-600">{t('questions.noResults.message')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredFaqs.map((faq, index) => (
                    <Card key={index} className="border border-gray-200 hover:border-gray-300 transition-colors">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-3">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                                {React.createElement(categories[faq.category].icon, { 
                                  className: "w-4 h-4 text-gray-600" 
                                })}
                              </span>
                              <h3 className="text-lg font-medium text-gray-900 flex-1">
                                {faq.question}
                              </h3>
                            </div>
                            <ChevronDown 
                              className={`w-5 h-5 text-gray-400 transition-transform ${expandedItems.has(index.toString()) ? 'rotate-180' : ''}`} 
                            />
                          </div>
                        </button>
                        
                        {expandedItems.has(index.toString()) && (
                          <div className="px-6 pb-6 pt-0">
                            <div className="border-t border-gray-100 pt-4 ml-11">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Contact Section */}
              <div className="mt-16">
                <Card className="border border-primary-100 bg-primary-50/30">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                      <MessageSquare className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-primary-900 mb-2">{t('questions.contact.title')}</h3>
                    <p className="text-primary-700 mb-4">
                      {t('questions.contact.message')}
                    </p>
                    {config.content.contactEmail && (
                      <a
                        href={`mailto:${config.content.contactEmail}`}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {t('questions.contact.button')}
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}
