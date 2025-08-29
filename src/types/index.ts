// Core API Types
export interface PublicFormConfig {
  company: {
    id: string
    name: string
    subdomain: string
  }
  branding: {
    name: string
    logo: string
    subdomain: string
  }
  colors: {
    primary: string
    accent: string
    success: string
    error: string
  }
  content: {
    welcomeTitle: string
    welcomeSubtitle: string
    footerText: string
    privacyPolicy: string
    contactEmail: string
  }
  categories: Array<{
    id: string
    name: string
    description: string
    color: string
    isActive: boolean
  }>
  formSettings: {
    allowAnonymous: boolean
    requireEmail: boolean
    allowFileUploads: boolean
    maxFileSize: number
    maxFiles: number
    allowedFileTypes: string[]
    trackingModes: string[]
    enableTracking: boolean
  }
}

// Report Submission Types
export interface ReportSubmissionRequest {
  subdomain: string
  categoryId: string
  subject: string
  description: string
  trackingMode: 'public' | 'private'
  trackingPassword?: string
  isAnonymous: boolean
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  files?: File[]
}

export interface ReportSubmissionResponse {
  success: boolean
  trackingId: string
  message?: string
  error?: string
}

// Report Tracking Types
export interface ReportTrackingResponse {
  success: boolean
  report?: {
    trackingId: string
    status: string
    subject: string
    createdAt: string
    updatedAt: string
    comments: Array<{
      content: string
      isInternal: boolean
      createdAt: string
    }>
  }
  error?: string
}

// Form State Types
export interface FormData {
  categoryId: string
  subject: string
  description: string
  trackingMode: 'public' | 'private'
  trackingPassword: string
  isAnonymous: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  files: File[]
}

export interface ValidationErrors {
  [key: string]: string | undefined
}

// Component Props Types
export interface CategoryConfig {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
}

export interface BrandingConfig {
  name: string
  logo: string
  subdomain: string
}

export interface ColorConfig {
  primary: string
  accent: string
  success: string
  error: string
}

export interface ContentConfig {
  welcomeTitle: string
  welcomeSubtitle: string
  footerText: string
  privacyPolicy: string
  contactEmail: string
}

// File Upload Types
export interface FileUploadConfig {
  maxFileSize: number
  maxFiles: number
  allowedFileTypes: string[]
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

// Rate Limiting Types
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

// Cache Types
export interface CachedConfig {
  config: PublicFormConfig
  timestamp: number
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Public Case Submission API Types
export interface CaseSubmissionRequest {
  subdomain: string
  title: string
  description: string
  typeKey?: string
  categoryKey: string
  priorityKey?: string
  severityKey?: string
  isAnonymous?: boolean
  visibility?: 'public' | 'internal' | 'restricted'
  reporterName?: string
  reporterEmail?: string
  reporterPhone?: string
  tags?: string[]
}

export interface CaseSubmissionResponse {
  success: boolean
  case?: {
    id: string
    caseNumber: string
    title: string
    status: string
    createdAt: string
  }
  message?: string
  error?: string
}

export interface RateLimitEntry {
  count: number
  resetTime: number
}

export interface RateLimitStorage {
  [ip: string]: RateLimitEntry
}

// Theme Types
export interface ThemeColors {
  primary: Record<string, string>
  accent: Record<string, string>
  success: Record<string, string>
  error: Record<string, string>
}
