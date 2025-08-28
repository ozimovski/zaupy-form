'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { dashboardApi } from '@/lib/api'
import type { ReportTrackingResponse } from '@/types'
import { DEFAULT_SUBDOMAIN } from '@/lib/constants'
import { 
  CheckCircle, 
  Info, 
  Clock, 
  MessageSquare, 
  AlertTriangle 
} from 'lucide-react'

export default function TrackPage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const initialTrackingId = searchParams.get('trackingId') || ''
  const initialPassword = searchParams.get('password') || ''

  const { config, loading, error } = useFormConfig(DEFAULT_SUBDOMAIN)
  
  const [trackingId, setTrackingId] = useState(initialTrackingId)
  const [password, setPassword] = useState(initialPassword)
  const [tracking, setTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState<ReportTrackingResponse | null>(null)
  const [trackingError, setTrackingError] = useState<string | null>(null)

  useEffect(() => {
    if (initialTrackingId) {
      void handleTrackReport()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleTrackReport(e?: React.FormEvent) {
    e?.preventDefault()

    if (!trackingId.trim()) {
      setTrackingError(t('validation.required'))
      return
    }

    try {
      setTracking(true)
      setTrackingError(null)
      setTrackingResult(null)
      
      const result = await dashboardApi.trackReport(trackingId.trim(), password.trim() || undefined)
      setTrackingResult(result)
    } catch (err) {
      setTrackingError(err instanceof Error ? err.message : t('errors.trackingFailed'))
    } finally {
      setTracking(false)
    }
  }

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
          <p>{error || t('errors.configErrorDescription')}</p>
        </Alert>
      </div>
    )
  }

  return (
    <ConfigProvider config={config} loading={loading} error={error}>
      <ThemeProvider config={config}>
        <PageLayout config={config}>
          <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-6 py-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-3">{t('tracking.title')}</h1>
                <p className="text-lg text-gray-600">
                  {t('tracking.subtitle')}
                </p>
              </div>

              {/* Tracking Form */}
              <Card className="border border-gray-200 mb-8">
                <CardContent className="p-8">
                    <form onSubmit={handleTrackReport} className="space-y-6">
                      <div className="space-y-4">
                        <Input
                          label={t('tracking.trackingId.label')}
                          placeholder={t('tracking.trackingId.placeholder')}
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          required
                          helperText={t('tracking.trackingId.helper')}
                        />

                        <Input
                          type="password"
                          label={t('tracking.password.label')}
                          placeholder={t('tracking.password.placeholder')}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          helperText={t('tracking.password.helper')}
                        />
                      </div>

                      {trackingError && (
                        <Alert variant="error">
                          {trackingError}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        loading={tracking}
                        disabled={tracking || !trackingId.trim()}
                        className="w-full"
                        size="lg"
                      >
                        {tracking ? t('tracking.tracking') : t('tracking.submit')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

              {/* Help Section */}
              {!trackingResult && (
                <Card className="border border-primary-100 bg-primary-50/30 mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Info className="w-5 h-5 text-primary-600 mt-0.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-primary-900 mb-1">{t('tracking.help.title')}</h3>
                        <div className="text-sm text-primary-700 space-y-1">
                          {t.raw('tracking.help.tips').map((tip: string, index: number) => (
                            <p key={index}>• {tip}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Section */}
              {trackingResult && (
                <div className="mt-8">
                  {trackingResult.success && trackingResult.report ? (
                    <Card className="border border-gray-200">
                      <CardContent className="p-8">
                      <div className="space-y-8">
                        {/* Status Header */}
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">{t('tracking.found.title')}</h3>
                          <StatusBadge status={trackingResult.report.status} />
                        </div>

                        {/* Report Details */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 mb-1">{t('tracking.found.trackingId')}</dt>
                              <dd className="text-sm font-mono bg-white px-3 py-2 rounded border">{trackingResult.report.trackingId}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 mb-1">{t('tracking.found.subject')}</dt>
                              <dd className="text-sm text-gray-900">{trackingResult.report.subject}</dd>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <dt className="text-sm font-medium text-gray-500 mb-1">{t('tracking.found.submitted')}</dt>
                                <dd className="text-sm text-gray-900">{new Date(trackingResult.report.createdAt).toLocaleDateString('sl-SI', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500 mb-1">{t('tracking.found.lastUpdated')}</dt>
                                <dd className="text-sm text-gray-900">{new Date(trackingResult.report.updatedAt).toLocaleDateString('sl-SI', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Timeline/Updates */}
                        {trackingResult.report?.comments && trackingResult.report.comments.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('tracking.timeline.title')}</h3>
                            <div className="space-y-4">
                              {trackingResult.report.comments.filter(comment => !comment.isInternal).map((comment, index, filteredComments) => (
                                <div key={index} className="relative pl-8">
                                  <div className="absolute left-0 top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  {index !== filteredComments.length - 1 && (
                                    <div className="absolute left-0.5 top-3 w-0.5 h-full bg-gray-200"></div>
                                  )}
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-gray-700 mb-2">{comment.content}</p>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No Updates Message */}
                        {(!trackingResult.report?.comments || trackingResult.report.comments.filter(c => !c.isInternal).length === 0) && (
                          <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                              <MessageSquare className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500">{t('tracking.timeline.noUpdates')}</p>
                            <p className="text-sm text-gray-400 mt-1">{t('tracking.timeline.noUpdatesDescription')}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    </Card>
                  ) : (
                    /* Not Found State */
                    <Card className="border border-gray-200">
                      <CardContent className="p-8">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tracking.notFound.title')}</h3>
                          <p className="text-gray-600 mb-6">
                            {t('tracking.notFound.message')}
                          </p>
                          <div className="space-y-2 text-sm text-gray-500">
                            {t.raw('tracking.notFound.tips').map((tip: string, index: number) => (
                              <p key={index}>• {tip}</p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}


