'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { dashboardApi } from '@/lib/api'
import type { ReportTrackingResponse } from '@/types'

export default function TrackReportPage() {
  const params = useParams()
  const subdomain = params.subdomain as string
  const { t } = useTranslation()
  
  const { config, loading, error } = useFormConfig(subdomain)
  
  const [trackingId, setTrackingId] = useState('')
  const [password, setPassword] = useState('')
  const [tracking, setTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState<ReportTrackingResponse | null>(null)
  const [trackingError, setTrackingError] = useState<string | null>(null)

  const handleTrackReport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingId.trim()) {
      setTrackingError('Please enter a tracking ID')
      return
    }

    try {
      setTracking(true)
      setTrackingError(null)
      setTrackingResult(null)
      
      const result = await dashboardApi.trackReport(trackingId.trim(), password.trim() || undefined)
      setTrackingResult(result)
    } catch (err) {
      setTrackingError(err instanceof Error ? err.message : 'Failed to track report')
    } finally {
      setTracking(false)
    }
  }

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
        <Alert variant="error" title="Configuration Error">
          <p>{error || 'Unable to load page configuration.'}</p>
        </Alert>
      </div>
    )
  }

  return (
    <ConfigProvider config={config} loading={loading} error={error}>
      <ThemeProvider config={config}>
        <PageLayout config={config}>
          <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Track Your Report
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Enter your tracking ID to check the status and progress of your submitted report.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tracking Form */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-primary-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl">Track Report Status</CardTitle>
                    <CardDescription className="text-primary-100">
                      Use your tracking ID to check your report status
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <form onSubmit={handleTrackReport} className="space-y-6">
                      <Input
                        label="Tracking ID"
                        placeholder="Enter your tracking ID..."
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        required
                        helperText="The tracking ID provided when you submitted your report"
                      />

                      <Input
                        type="password"
                        label="Password (if required)"
                        placeholder="Enter password for private reports..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText="Only required for reports with private tracking"
                      />

                      {trackingError && (
                        <Alert variant="error">
                          {trackingError}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        loading={tracking}
                        disabled={tracking || !trackingId.trim()}
                        className="w-full bg-primary-600 hover:bg-primary-700"
                        size="lg"
                      >
                        {tracking ? 'Checking Status...' : 'Track Report'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Information */}
                <div className="space-y-6">
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-success-600 text-white rounded-t-lg">
                      <CardTitle className="text-lg">How Tracking Works</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-success-600 text-sm font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">Enter Tracking ID</h4>
                            <p className="text-xs text-gray-600">Use the ID provided after submission</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-success-600 text-sm font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">Add Password (if needed)</h4>
                            <p className="text-xs text-gray-600">Required for private tracking only</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-success-600 text-sm font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">View Status</h4>
                            <p className="text-xs text-gray-600">See current status and updates</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-accent-600 text-white rounded-t-lg">
                      <CardTitle className="text-lg">{t('trackingHelp.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3 text-sm text-gray-700">
                        <p><strong>{t('trackingHelp.lostTrackingId.title')}</strong></p>
                        <p>{t('trackingHelp.lostTrackingId.description')}</p>
                        
                        <p><strong>{t('trackingHelp.reportNotFound.title')}</strong></p>
                        <p>{t('trackingHelp.reportNotFound.description')}</p>
                        
                        {config.content.contactEmail && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs">
                              <strong>{t('trackingHelp.contact')}</strong>{' '}
                              <a 
                                href={`mailto:${config.content.contactEmail}`}
                                className="text-primary-600 hover:text-primary-800"
                              >
                                {config.content.contactEmail}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tracking Results */}
              {trackingResult && trackingResult.success && trackingResult.report && (
                <div className="mt-8">
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-primary-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl">{t('trackingResults.title')}</CardTitle>
                      <CardDescription className="text-primary-100">
                        {t('trackingResults.subtitle')}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">{t('trackingResults.reportDetails')}</h3>
                          <div className="space-y-2 text-sm">
                            <div><strong>{t('trackingResults.trackingId')}</strong> {trackingResult.report.trackingId}</div>
                            <div><strong>{t('trackingResults.subject')}</strong> {trackingResult.report.subject}</div>
                            <div><strong>{t('trackingResults.status')}</strong> 
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {trackingResult.report.status}
                              </span>
                            </div>
                            <div><strong>{t('trackingResults.submitted')}</strong> {new Date(trackingResult.report.createdAt).toLocaleDateString()}</div>
                            <div><strong>{t('trackingResults.lastUpdated')}</strong> {new Date(trackingResult.report.updatedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        {trackingResult.report.comments && trackingResult.report.comments.length > 0 && (
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">{t('trackingResults.updatesComments')}</h3>
                            <div className="space-y-3">
                              {trackingResult.report.comments.filter(comment => !comment.isInternal).map((comment, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}
function useTranslation(): { t: any } {
  throw new Error('Function not implemented.')
}

