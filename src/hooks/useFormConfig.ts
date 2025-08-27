import { useState, useEffect } from 'react'
import { dashboardApi } from '@/lib/api'
import type { PublicFormConfig } from '@/types'

interface UseFormConfigResult {
  config: PublicFormConfig | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFormConfig(subdomain: string): UseFormConfigResult {
  const [config, setConfig] = useState<PublicFormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    if (!subdomain) {
      setError('Subdomain is required')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const configData = await dashboardApi.getFormConfig(subdomain)
      setConfig(configData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration')
      setConfig(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [subdomain])

  const refetch = async () => {
    await fetchConfig()
  }

  return {
    config,
    loading,
    error,
    refetch,
  }
}
