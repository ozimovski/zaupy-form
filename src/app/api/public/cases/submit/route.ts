import { NextRequest, NextResponse } from 'next/server'
import { validateCaseSubmission } from '@/lib/validation'
import type { CaseSubmissionRequest, CaseSubmissionResponse, RateLimitStorage } from '@/types'

// In-memory rate limit storage (in production, use Redis or similar)
const rateLimitStorage: RateLimitStorage = {}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5

// CORS configuration
const ALLOWED_ORIGIN = process.env.FORMS_DOMAIN || '*'

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return request.ip || 'unknown'
}

// Rate limiting function
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  
  // Clean up expired entries
  Object.keys(rateLimitStorage).forEach(key => {
    if (rateLimitStorage[key].resetTime < now) {
      delete rateLimitStorage[key]
    }
  })
  
  const entry = rateLimitStorage[ip]
  
  if (!entry) {
    // First request from this IP
    rateLimitStorage[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    }
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: rateLimitStorage[ip].resetTime
    }
  }
  
  if (entry.resetTime < now) {
    // Window has expired, reset counter
    rateLimitStorage[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    }
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: rateLimitStorage[ip].resetTime
    }
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }
  
  // Increment counter
  entry.count++
  
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
    resetTime: entry.resetTime
  }
}

// CORS headers helper
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  })
}

// Main POST handler
export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders()
  
  try {
    // Get client IP and check rate limit
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait before submitting another case.',
        } as CaseSubmissionResponse,
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      )
    }
    
    // Parse and validate request body
    let requestBody: CaseSubmissionRequest
    try {
      requestBody = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        } as CaseSubmissionResponse,
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }
    
    // Validate the submission data
    const validation = validateCaseSubmission(requestBody)
    
    if (!validation.success) {
      const errorDetails = Object.entries(validation.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ')
      
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errorDetails,
        } as CaseSubmissionResponse,
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }
    
    const validatedData = validation.data!
    
    // Forward to dashboard API
    const dashboardUrl = process.env.DASHBOARD_API_URL
    
    if (!dashboardUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dashboard API URL not configured',
        } as CaseSubmissionResponse,
        {
          status: 503,
          headers: corsHeaders,
        }
      )
    }
    
    // Prepare the payload for the dashboard API
    const dashboardPayload = {
      subdomain: validatedData.subdomain,
      title: validatedData.title,
      description: validatedData.description,
      typeKey: validatedData.typeKey,
      categoryKey: validatedData.categoryKey,
      priorityKey: validatedData.priorityKey,
      severityKey: validatedData.severityKey,
      isAnonymous: validatedData.isAnonymous,
      visibility: validatedData.visibility,
      reporterName: validatedData.reporterName,
      reporterEmail: validatedData.reporterEmail,
      reporterPhone: validatedData.reporterPhone,
      tags: validatedData.tags,
    }
    
    // Make request to dashboard API
    const dashboardResponse = await fetch(`${dashboardUrl}/api/public/cases/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(dashboardPayload),
      cache: 'no-store',
    })
    
    const dashboardData = await dashboardResponse.json()
    
    // Handle dashboard API errors
    if (!dashboardResponse.ok) {
      // Check for specific error types
      if (dashboardResponse.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'Company not found',
          } as CaseSubmissionResponse,
          {
            status: 404,
            headers: corsHeaders,
          }
        )
      }
      
      if (dashboardResponse.status === 400 && dashboardData.error) {
        // Pass through validation errors from dashboard
        return NextResponse.json(
          {
            success: false,
            error: dashboardData.error,
          } as CaseSubmissionResponse,
          {
            status: 400,
            headers: corsHeaders,
          }
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to submit case. Please try again later.',
        } as CaseSubmissionResponse,
        {
          status: 500,
          headers: corsHeaders,
        }
      )
    }
    
    // Return success response
    return NextResponse.json(
      dashboardData as CaseSubmissionResponse,
      {
        status: 201,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    )
    
  } catch (error) {
    console.error('Failed to submit case:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit case. Please try again later.',
      } as CaseSubmissionResponse,
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}
