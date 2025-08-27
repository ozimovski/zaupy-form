'use client'

import React, { createContext, useContext } from 'react'
import type { PublicFormConfig } from '@/types'

interface ConfigContextType {
  config: PublicFormConfig | null
  loading: boolean
  error: string | null
}

const ConfigContext = createContext<ConfigContextType>({
  config: null,
  loading: true,
  error: null,
})

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}

interface ConfigProviderProps {
  children: React.ReactNode
  config: PublicFormConfig | null
  loading: boolean
  error: string | null
}

export function ConfigProvider({ children, config, loading, error }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  )
}
