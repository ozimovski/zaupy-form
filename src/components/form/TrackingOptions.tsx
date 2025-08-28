import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export interface TrackingOptionsProps {
  trackingMode: 'public' | 'private'
  trackingPassword: string
  onTrackingModeChange: (mode: 'public' | 'private') => void
  onPasswordChange: (password: string) => void
  enableTracking: boolean
  trackingModes: string[]
  errors?: {
    trackingMode?: string
    trackingPassword?: string
  }
}

export function TrackingOptions({
  trackingMode,
  trackingPassword,
  onTrackingModeChange,
  onPasswordChange,
  enableTracking,
  trackingModes,
  errors,
}: TrackingOptionsProps) {
  const t = useTranslations()
  
  const hasPublicTracking = trackingModes.includes('public')
  const hasPrivateTracking = trackingModes.includes('private')

  // If only one mode is available, auto-select it
  React.useEffect(() => {
    if (!enableTracking) return
    
    if (hasPublicTracking && !hasPrivateTracking && trackingMode !== 'public') {
      onTrackingModeChange('public')
    } else if (hasPrivateTracking && !hasPublicTracking && trackingMode !== 'private') {
      onTrackingModeChange('private')
    }
  }, [enableTracking, hasPublicTracking, hasPrivateTracking, trackingMode, onTrackingModeChange])

  if (!enableTracking) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('form.tracking.label')}
        </label>
        <div className="space-y-3">
          {hasPublicTracking && (
            <Card className={trackingMode === 'public' ? 'ring-2 ring-primary-500' : ''}>
              <CardContent className="p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="trackingMode"
                    value="public"
                    checked={trackingMode === 'public'}
                    onChange={(e) => onTrackingModeChange(e.target.value as 'public')}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t('form.tracking.public.title')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('form.tracking.public.description')}
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          )}

          {hasPrivateTracking && (
            <Card className={trackingMode === 'private' ? 'ring-2 ring-primary-500' : ''}>
              <CardContent className="p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="trackingMode"
                    value="private"
                    checked={trackingMode === 'private'}
                    onChange={(e) => onTrackingModeChange(e.target.value as 'private')}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t('form.tracking.private.title')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('form.tracking.private.description')}
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          )}
        </div>
        {errors?.trackingMode && (
          <p className="mt-2 text-sm text-error-600" role="alert">
            {errors.trackingMode}
          </p>
        )}
      </div>

      {trackingMode === 'private' && (
        <Input
          type="password"
          label={t('form.tracking.private.passwordLabel')}
          placeholder={t('form.tracking.private.passwordPlaceholder')}
          value={trackingPassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          error={errors?.trackingPassword}
          required
          helperText={t('form.tracking.private.passwordHelper')}
        />
      )}
    </div>
  )
}
