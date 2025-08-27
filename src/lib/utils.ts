import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ThemeColors } from '@/types'

// Utility function for combining classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function generateColorShades(baseColor: string): Record<string, string> {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return {}

  const shades: Record<string, string> = {}
  const { r, g, b } = rgb

  // Generate lighter shades (50-400)
  for (let i = 50; i <= 400; i += 50) {
    const factor = (500 - i) / 500
    const newR = Math.round(r + (255 - r) * (1 - factor))
    const newG = Math.round(g + (255 - g) * (1 - factor))
    const newB = Math.round(b + (255 - b) * (1 - factor))
    shades[i.toString()] = `${newR} ${newG} ${newB}`
  }

  // Base color (500)
  shades['500'] = `${r} ${g} ${b}`

  // Generate darker shades (600-950)
  for (let i = 600; i <= 950; i += 50) {
    const factor = (i - 500) / 450
    const newR = Math.round(r * (1 - factor))
    const newG = Math.round(g * (1 - factor))
    const newB = Math.round(b * (1 - factor))
    shades[i.toString()] = `${newR} ${newG} ${newB}`
  }

  return shades
}

// Theme utilities
export function applyThemeColors(colors: {
  primary: string
  accent: string
  success: string
  error: string
}): void {
  const root = document.documentElement

  // Generate and apply primary colors
  const primaryShades = generateColorShades(colors.primary)
  Object.entries(primaryShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-primary-${shade}`, rgb)
  })

  // Generate and apply accent colors
  const accentShades = generateColorShades(colors.accent)
  Object.entries(accentShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-accent-${shade}`, rgb)
  })

  // Generate and apply success colors
  const successShades = generateColorShades(colors.success)
  Object.entries(successShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-success-${shade}`, rgb)
  })

  // Generate and apply error colors
  const errorShades = generateColorShades(colors.error)
  Object.entries(errorShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-error-${shade}`, rgb)
  })
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return '.' + filename.split('.').pop()?.toLowerCase() || ''
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Date utilities
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Form utilities
export function generateTrackingId(): string {
  const prefix = 'RPT'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}-${timestamp}${random}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL utilities
export function getSubdomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.hostname.split('.')
    
    if (parts.length > 2) {
      return parts[0]
    }
    
    return null
  } catch {
    return null
  }
}

export function getSubdomainFromHostname(hostname: string): string | null {
  const parts = hostname.split('.')
  
  if (parts.length > 2) {
    return parts[0]
  }
  
  return null
}

// Error utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

// Validation utilities
export function isValidSubdomain(subdomain: string): boolean {
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
  return subdomainRegex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 63
}

// Loading state utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
