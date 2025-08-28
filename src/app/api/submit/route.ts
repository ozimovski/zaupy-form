import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_API_URL

  if (!dashboardUrl) {
    return NextResponse.json(
      { error: 'Dashboard API URL not configured' },
      { status: 503 }
    )
  }

  try {
    const contentType = request.headers.get('content-type') || ''
    
    let body: string | FormData
    const forwardHeaders: Record<string, string> = {
      'Accept': 'application/json',
    }

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (when files are present)
      body = await request.formData()
      // Don't set Content-Type for FormData - let fetch handle it
    } else {
      // Handle JSON (text-only submissions)
      body = await request.text()
      forwardHeaders['Content-Type'] = 'application/json'
    }
    
    const res = await fetch(`${dashboardUrl}/api/public/reports/submit`, {
      method: 'POST',
      body,
      headers: forwardHeaders,
      cache: 'no-store',
    })

    const data = await res.json()

    return NextResponse.json(data, { 
      status: res.status 
    })
  } catch (error) {
    console.error('Failed to submit report:', error)
    return NextResponse.json(
      { error: 'Failed to connect to dashboard API' },
      { status: 502 }
    )
  }
}


