'use client'

import React, { useEffect } from 'react'
import { applyThemeColors } from '@/lib/utils'
import type { PublicFormConfig } from '@/types'

interface ThemeProviderProps {
  children: React.ReactNode
  config: PublicFormConfig | null
}

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  useEffect(() => {
    if (config?.colors) {
      applyThemeColors(config.colors)
    }
  }, [config?.colors])

  return (
    <div className="theme-provider min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
