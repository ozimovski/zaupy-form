import { z } from 'zod'

// Base validation schemas
export const reportSubmissionSchema = z.object({
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be less than 63 characters')
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, 'Invalid subdomain format'),
  
  categoryId: z
    .string()
    .min(1, 'Please select a valid category'),
  
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(500, 'Subject must be less than 500 characters')
    .trim(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  
  trackingMode: z.enum(['public', 'private'], {
    errorMap: () => ({ message: 'Please select a tracking mode' })
  }),
  
  trackingPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  
  isAnonymous: z.boolean(),
  
  priority: z
    .enum(['low', 'medium', 'high', 'urgent'])
    .optional(),
})

// Conditional validation based on tracking mode
export const conditionalReportSchema = reportSubmissionSchema.refine(
  (data) => {
    if (data.trackingMode === 'private' && (!data.trackingPassword || data.trackingPassword.length < 6)) {
      return false
    }
    return true
  },
  {
    message: 'Password is required for private tracking',
    path: ['trackingPassword'],
  }
)

// File validation
export const fileValidationSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().positive('File size must be positive'),
  type: z.string().min(1, 'File type is required'),
})

// Email validation (optional for contact)
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .optional()
  .or(z.literal(''))

// Tracking lookup validation
export const trackingLookupSchema = z.object({
  trackingId: z
    .string()
    .min(3, 'Tracking ID is required')
    .max(50, 'Invalid tracking ID format'),
  
  password: z
    .string()
    .optional()
    .or(z.literal('')),
})

// Form data type inference
export type ReportSubmissionData = z.infer<typeof reportSubmissionSchema>
export type TrackingLookupData = z.infer<typeof trackingLookupSchema>

// File validation function
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } {
  // File type validation
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  if (!allowedTypes.includes(fileExtension) && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${fileExtension} is not allowed`,
    }
  }

  // File size validation (maxSize is in MB)
  if (file.size > maxSize * 1024 * 1024) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize}MB limit`,
    }
  }

  // Additional security checks
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      valid: false,
      error: 'Invalid file name',
    }
  }

  return { valid: true }
}

// Validation helper functions
export function validateForm(data: any) {
  try {
    return {
      success: true,
      data: conditionalReportSchema.parse(data),
      errors: {},
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return {
        success: false,
        data: null,
        errors,
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' },
    }
  }
}

export function validateTrackingLookup(data: any) {
  try {
    return {
      success: true,
      data: trackingLookupSchema.parse(data),
      errors: {},
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return {
        success: false,
        data: null,
        errors,
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' },
    }
  }
}
