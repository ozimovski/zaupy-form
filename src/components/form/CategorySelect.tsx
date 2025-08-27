import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Select } from '@/components/ui/Select'
import type { CategoryConfig } from '@/types'

export interface CategorySelectProps {
  categories: CategoryConfig[]
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export function CategorySelect({
  categories,
  value,
  onChange,
  error,
  required = true,
}: CategorySelectProps) {
  const t = useTranslations()
  const activeCategories = categories.filter(category => category.isActive)

  const options = activeCategories.map(category => ({
    value: category.id,
    label: category.name,
    disabled: false,
  }))

  return (
    <Select
      label={t('form.category.label')}
      placeholder={t('form.category.placeholder')}
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      required={required}
      helperText={t('form.category.helper')}
    />
  )
}
