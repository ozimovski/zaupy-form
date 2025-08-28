import type {
  PublicFormConfig,
  ReportSubmissionRequest,
  ReportSubmissionResponse,
  ReportTrackingResponse,
  ApiResponse,
} from '@/types'

class DashboardApiClient {
  private baseUrl: string

  constructor() {
    // Point to local proxy API routes; they will forward to dashboard or serve dev fallback
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async getFormConfig(subdomain: string): Promise<PublicFormConfig> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/api/config/${subdomain}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`)
      }

      const data: PublicFormConfig = await response.json()
      
      // Your dashboard API returns the config directly, not wrapped in ApiResponse
      if (!data.company || !data.branding) {
        throw new Error('Invalid configuration format received')
      }

      return data
    } catch (error) {
      console.error('Failed to fetch form config:', error)
      throw new Error('Unable to load form configuration. Please try again later.')
    }
  }

  async submitReport(data: ReportSubmissionRequest): Promise<ReportSubmissionResponse> {
    try {
      // Prepare submission data
      const submissionData = {
        subdomain: data.subdomain,
        categoryId: data.categoryId,
        subject: data.subject,
        description: data.description,
        trackingMode: data.trackingMode,
        isAnonymous: data.isAnonymous,
        ...(data.trackingPassword && { trackingPassword: data.trackingPassword }),
        ...(data.priority && { priority: data.priority }),
      }

      console.log('API Client: Submitting data:', submissionData)

      let requestBody: string | FormData
      const headers: Record<string, string> = {}

      // Use FormData if files are present, otherwise use JSON
      if (data.files && data.files.length > 0) {
        const formData = new FormData()
        
        // Add JSON data as a single field
        formData.append('data', JSON.stringify(submissionData))
        
        // Add files
        data.files.forEach((file) => {
          formData.append('files', file)
        })
        
        requestBody = formData
        // Don't set Content-Type for FormData - let browser set it with boundary
      } else {
        // Use JSON for text-only submissions
        requestBody = JSON.stringify(submissionData)
        headers['Content-Type'] = 'application/json'
      }

      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/api/submit`,
        {
          method: 'POST',
          body: requestBody,
          headers,
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Submission failed: ${response.status}`)
      }

      const result: ReportSubmissionResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Submission failed')
      }

      return result
    } catch (error) {
      console.error('Failed to submit report:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to submit report. Please try again.')
    }
  }

  async trackReport(trackingId: string, password?: string): Promise<ReportTrackingResponse> {
    try {
      const url = new URL(`${this.baseUrl}/api/track/${trackingId}`)
      if (password) {
        url.searchParams.append('password', password)
      }

      const response = await this.fetchWithTimeout(url.toString())

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Tracking failed: ${response.status}`)
      }

      const result: ReportTrackingResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Tracking failed')
      }

      return result
    } catch (error) {
      console.error('Failed to track report:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to track report. Please try again.')
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/health`, {}, 5000)
      return response.ok
    } catch {
      return false
    }
  }
}

export const dashboardApi = new DashboardApiClient()
