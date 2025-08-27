import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { CategorySelect } from './CategorySelect'
import { TrackingOptions } from './TrackingOptions'
import { FileUpload } from '@/components/ui/FileUpload'
import type { FormData, CategoryConfig, ValidationErrors } from '@/types'

export interface FormFieldsProps {
  formData: FormData
  categories: CategoryConfig[]
  onInputChange: (field: keyof FormData, value: any) => void
  errors: ValidationErrors
  config: {
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

export function FormFields({
  formData,
  categories,
  onInputChange,
  errors,
  config,
}: FormFieldsProps) {
  const t = useTranslations()
  
  const priorityOptions = [
    { value: 'low', label: t('form.priority.low') },
    { value: 'medium', label: t('form.priority.medium') },
    { value: 'high', label: t('form.priority.high') },
    { value: 'urgent', label: t('form.priority.urgent') },
  ]

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <CategorySelect
        categories={categories}
        value={formData.categoryId}
        onChange={(value) => onInputChange('categoryId', value)}
        error={errors.categoryId}
        required
      />

      {/* Subject */}
      <Input
        type="text"
        label={t('form.subject.label')}
        placeholder={t('form.subject.placeholder')}
        value={formData.subject}
        onChange={(e) => onInputChange('subject', e.target.value)}
        error={errors.subject}
        required
        maxLength={500}
        helperText={t('form.subject.helper')}
      />

      {/* Description */}
      <Textarea
        label={t('form.description.label')}
        placeholder={t('form.description.placeholder')}
        value={formData.description}
        onChange={(e) => onInputChange('description', e.target.value)}
        error={errors.description}
        required
        maxLength={5000}
        showCharCount
        rows={6}
        helperText={t('form.description.helper')}
      />

      {/* Priority */}
      <Select
        label={t('form.priority.label')}
        placeholder={t('form.priority.placeholder')}
        options={priorityOptions}
        value={formData.priority}
        onChange={(e) => onInputChange('priority', e.target.value)}
        error={errors.priority}
        helperText={t('form.priority.helper')}
      />

      {/* Anonymous Reporting Option */}
      {config.allowAnonymous && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t('form.anonymous.label')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => onInputChange('isAnonymous', e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                {t('form.anonymous.checkbox')}
              </span>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            {t('form.anonymous.helper')}
          </p>
        </div>
      )}

      {/* File Upload */}
      {config.allowFileUploads && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('form.files.label')}
          </label>
          <FileUpload
            files={formData.files}
            onFilesChange={(files) => onInputChange('files', files)}
            maxFiles={config.maxFiles}
            maxSize={config.maxFileSize}
            allowedTypes={config.allowedFileTypes}
            error={errors.files}
          />
          <p className="text-sm text-gray-600">
            {t('form.files.helper')}
          </p>
        </div>
      )}

      {/* Tracking Options */}
      <TrackingOptions
        trackingMode={formData.trackingMode}
        trackingPassword={formData.trackingPassword}
        onTrackingModeChange={(mode) => onInputChange('trackingMode', mode)}
        onPasswordChange={(password) => onInputChange('trackingPassword', password)}
        enableTracking={config.enableTracking}
        trackingModes={config.trackingModes}
        errors={{
          trackingMode: errors.trackingMode,
          trackingPassword: errors.trackingPassword,
        }}
      />
    </div>
  )
}
