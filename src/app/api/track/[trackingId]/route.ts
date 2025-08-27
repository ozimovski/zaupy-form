import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { trackingId: string } }
) {
  const { trackingId } = context.params
  const password = request.nextUrl.searchParams.get('password')
  const dashboardUrl = process.env.DASHBOARD_API_URL

  if (!dashboardUrl) {
    return NextResponse.json(
      { error: 'Dashboard API URL not configured' },
      { status: 503 }
    )
  }

  try {
    const url = new URL(`${dashboardUrl}/api/reports/track/${encodeURIComponent(trackingId)}`)
    if (password) {
      url.searchParams.set('password', password)
    }

    const res = await fetch(url.toString(), { 
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, 
      cache: 'no-store' 
    })

    const data = await res.json()

    return NextResponse.json(data, { 
      status: res.status 
    })
  } catch (error) {
    console.error(`Failed to track report ${trackingId}:`, error)
    return NextResponse.json(
      { error: 'Failed to connect to dashboard API' },
      { status: 502 }
    )
  }
}


