import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { subdomain: string } }
) {
  const { subdomain } = context.params
  const dashboardUrl = process.env.DASHBOARD_API_URL

  if (!dashboardUrl) {
    return NextResponse.json(
      { error: 'Dashboard API URL not configured' },
      { status: 503 }
    )
  }

  try {
    const res = await fetch(
      `${dashboardUrl}/api/public/forms/${encodeURIComponent(subdomain)}/config`,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-store',
      }
    )

    const data = await res.json()

    // Return the response with same status code from dashboard
    return NextResponse.json(data, { 
      status: res.status,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    })
  } catch (error) {
    console.error(`Failed to fetch config for ${subdomain}:`, error)
    return NextResponse.json(
      { error: 'Failed to connect to dashboard API' },
      { status: 502 }
    )
  }
}


