import { NextRequest, NextResponse } from 'next/server'
import { dashboardApi } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    // Check dashboard API connectivity
    const dashboardHealthy = await dashboardApi.healthCheck()
    
    const status = dashboardHealthy ? 'healthy' : 'degraded'
    const timestamp = new Date().toISOString()

    const healthData = {
      status,
      timestamp,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        dashboard_api: dashboardHealthy,
        self: true,
      },
      environment: {
        node_env: process.env.NODE_ENV,
        dashboard_url: process.env.DASHBOARD_API_URL || 'not-configured',
      },
      uptime: process.uptime(),
    }

    const statusCode = status === 'healthy' ? 200 : 503

    return NextResponse.json(healthData, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        services: {
          dashboard_api: false,
          self: true,
        }
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  }
}
