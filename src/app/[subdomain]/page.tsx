'use client'

import { useParams, useRouter } from 'next/navigation'
import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { ReportForm } from '@/components/form/ReportForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

export default function SubdomainFormPage() {
  const params = useParams()
  const router = useRouter()
  const subdomain = params.subdomain as string

  const { config, loading, error, refetch } = useFormConfig(subdomain)

  const handleSubmissionSuccess = (trackingId: string) => {
    router.push(`/${subdomain}/success?trackingId=${trackingId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading form configuration...</p>
        </div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <Alert variant="error" title="Configuration Error">
            <div className="space-y-3">
              <p>{error || 'Unable to load form configuration.'}</p>
              <div className="flex space-x-3">
                <Button onClick={refetch} size="sm">
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/')}
                >
                  Go Home
                </Button>
              </div>
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
          <ReportForm 
            config={config} 
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}
