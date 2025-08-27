import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import type { PublicFormConfig } from '@/types'

interface PageLayoutProps {
  children: React.ReactNode
  config: PublicFormConfig
}

export function PageLayout({ children, config }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header branding={config.branding} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer 
        content={config.content} 
        branding={config.branding}
      />
    </div>
  )
}
