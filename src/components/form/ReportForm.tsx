'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { FormFields } from './FormFields'
import { useReportSubmission } from '@/hooks/useReportSubmission'
import { 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  Users, 
  Search,
  ArrowRight,
  Upload
} from 'lucide-react'
import type { PublicFormConfig, FormData } from '@/types'

interface ReportFormProps {
  config: PublicFormConfig
  onSubmissionSuccess: (trackingId: string) => void
}

export function ReportForm({ config, onSubmissionSuccess }: ReportFormProps) {
  const t = useTranslations()
  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    subject: '',
    description: '',
    trackingMode: config.formSettings.trackingModes.includes('public') ? 'public' : 'private',
    trackingPassword: '',
    isAnonymous: false,
    priority: 'medium',
    files: [],
  })

  const { submitReport, loading, error, validationErrors } = useReportSubmission()

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await submitReport(formData, config.company.subdomain)
    
    if (result?.success && result.trackingId) {
      onSubmissionSuccess(result.trackingId)
    }
  }

  const hasErrors = Object.keys(validationErrors).length > 0
  const isSubmitDisabled = loading || !formData.categoryId || !formData.subject || !formData.description

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {config.content.welcomeTitle || 'Submit a Report'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {config.content.welcomeSubtitle || 
             'Welcome to our secure internal reporting system. You can safely and confidentially provide information about violations of regulations that you have acquired in your work environment.'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-primary-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">{t('form.title')}</CardTitle>
                <CardDescription className="text-primary-100">
                  {t('form.subtitle')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* API Error */}
                  {error && (
                    <Alert variant="error" title={t('errors.submissionFailed')}>
                      {error}
                    </Alert>
                  )}

                  {/* Validation Errors Summary */}
                  {hasErrors && (
                    <Alert variant="error" title={t('errors.validationFailed')}>
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(validationErrors).map(([field, message]) => (
                          <li key={field} className="text-sm">
                            {message}
                          </li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  {/* Form Fields */}
                  <FormFields
                    formData={formData}
                    categories={config.categories}
                    onInputChange={handleInputChange}
                    errors={validationErrors}
                    config={config.formSettings}
                  />

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          categoryId: '',
                          subject: '',
                          description: '',
                          trackingMode: config.formSettings.trackingModes.includes('public') ? 'public' : 'private',
                          trackingPassword: '',
                          isAnonymous: false,
                          priority: 'medium',
                          files: [],
                        })
                      }}
                      disabled={loading}
                      className="flex-1 sm:flex-none"
                    >
                      Clear Form
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={isSubmitDisabled}
                      size="lg"
                      className="flex-1 bg-primary-600 hover:bg-primary-700"
                    >
                      {loading ? 'Submitting Report...' : 'Submit Report'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Categories Info */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-primary-600 text-white rounded-t-lg">
                <CardTitle className="text-lg">{t('form.whatToReport.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {config.categories.filter(cat => cat.isActive).slice(0, 6).map((category) => (
                    <div key={category.id} className="flex items-start space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                        <p className="text-xs text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-success-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>{t('form.privacy.title')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                    <p>{t('form.privacy.confidential')}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                    <p>{t('form.privacy.noIdentity')}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                    <p>{t('form.privacy.anonymousProtected')}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                    <p>{t('form.privacy.secureEncrypted')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-accent-600 text-white rounded-t-lg">
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Submit Report</h4>
                      <p className="text-xs text-gray-600">Fill out the form with relevant details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Get Tracking ID</h4>
                      <p className="text-xs text-gray-600">Receive a unique ID to track progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Professional Review</h4>
                      <p className="text-xs text-gray-600">Your report is reviewed by appropriate team</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-600">
              {t('form.footer.afterSubmission')}
              {config.formSettings.enableTracking && 
                ` ${t('form.footer.keepSafe')}`
              } {t('form.footer.goodFaith')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
