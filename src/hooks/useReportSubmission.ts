import { useState } from 'react'
import { dashboardApi } from '@/lib/api'
import { validateForm } from '@/lib/validation'
import type { FormData, ValidationErrors, ReportSubmissionResponse } from '@/types'

interface UseReportSubmissionResult {
  submitReport: (formData: FormData, subdomain: string) => Promise<ReportSubmissionResponse | null>
  loading: boolean
  error: string | null
  validationErrors: ValidationErrors
}

export function useReportSubmission(): UseReportSubmissionResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const submitReport = async (
    formData: FormData,
    subdomain: string
  ): Promise<ReportSubmissionResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors({})
      setHasAttemptedSubmit(true)

      // Validate form data
      const validation = validateForm({
        ...formData,
        subdomain,
      })

      if (!validation.success) {
        setValidationErrors(validation.errors)
        return null
      }

      // Submit to API
      const response = await dashboardApi.submitReport({
        subdomain,
        categoryId: formData.categoryId,
        subject: formData.subject,
        description: formData.description,
        trackingMode: formData.trackingMode,
        trackingPassword: formData.trackingPassword || undefined,
        isAnonymous: formData.isAnonymous,
        priority: formData.priority || undefined,
        files: formData.files.length > 0 ? formData.files : undefined,
      })

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit report'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    submitReport,
    loading,
    error,
    validationErrors: hasAttemptedSubmit ? validationErrors : {},
  }
}
