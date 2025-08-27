'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useFormConfig } from '@/hooks/useFormConfig'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { ReportForm } from '@/components/form/ReportForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { DEFAULT_SUBDOMAIN } from '@/lib/constants'

export default function FormPage() {
  const router = useRouter()
  const t = useTranslations()
  const { config, loading, error, refetch } = useFormConfig(DEFAULT_SUBDOMAIN)

  const handleSubmissionSuccess = (trackingId: string) => {
    router.push(`/track?trackingId=${trackingId}`)
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
        <div className="max-w-md mx-auto">
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
      </div>
    )
  }

  return (
    <ConfigProvider config={config} loading={loading} error={error}>
      <ThemeProvider config={config}>
        <PageLayout config={config}>
          <ReportForm config={config} onSubmissionSuccess={handleSubmissionSuccess} />
        </PageLayout>
      </ThemeProvider>
    </ConfigProvider>
  )
}


