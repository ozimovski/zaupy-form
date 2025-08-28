'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Link from 'next/link'

export default function SuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const subdomain = params.subdomain as string
  const trackingId = searchParams.get('trackingId')

  const { config, loading, error } = useFormConfig(subdomain)

  const copyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId)
      // You could add a toast notification here
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

  if (!trackingId) {
    return (
      <ConfigProvider config={config} loading={loading} error={error}>
        <ThemeProvider config={config}>
          <PageLayout config={config}>
            <div className="max-w-2xl mx-auto">
              <Alert variant="error" title="Missing Tracking Information">
                <div className="space-y-3">
                  <p>No tracking ID was provided. This page should only be accessed after successfully submitting a report.</p>
                  <Button onClick={() => router.push(`/${subdomain}`)}>
                    Submit New Report
                  </Button>
                </div>
              </Alert>
            </div>
          </PageLayout>
        </ThemeProvider>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider config={config} loading={loading} error={error}>
      <ThemeProvider config={config}>
        <PageLayout config={config}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Success Message */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Report Submitted Successfully
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for bringing this matter to our attention. Your report has been received and will be reviewed promptly.
              </p>
            </div>

            {/* Tracking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Tracking Information</span>
                </CardTitle>
                <CardDescription>
                  Save this information to track the status of your report
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Tracking ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-lg font-mono">
                      {trackingId}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyTrackingId}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <Alert variant="info">
                  <div className="text-sm">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="space-y-1">
                      <li>• Keep this tracking ID safe - it's your only way to check the status of your report</li>
                      <li>• You can bookmark this page or save the tracking ID separately</li>
                      {config.formSettings.enableTracking && (
                        <li>• Use the tracking form to check updates on your report</li>
                      )}
                    </ul>
                  </div>
                </Alert>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review</h4>
                      <p className="text-gray-600 text-sm">Your report will be reviewed by the appropriate team within 2-3 business days.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Investigation</h4>
                      <p className="text-gray-600 text-sm">If needed, a thorough investigation will be conducted with appropriate confidentiality measures.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Resolution</h4>
                      <p className="text-gray-600 text-sm">Appropriate action will be taken based on the findings, and you'll be updated via the tracking system.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {config.formSettings.enableTracking && (
                <Button variant="outline">
                  <Link href={`/${subdomain}/track`}>
                    Track Your Report
                  </Link>
                </Button>
              )}
              
              <Button variant="outline">
                <Link href={`/${subdomain}`}>
                  Submit Another Report
                </Link>
              </Button>
            </div>

            {/* Contact Information */}
            {config.content.contactEmail && (
              <div className="text-center text-sm text-gray-600">
                <p>
                  For questions about this process, contact:{' '}
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
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}
