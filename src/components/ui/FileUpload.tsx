import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { cn, formatFileSize, isImageFile } from '@/lib/utils'
import { validateFile } from '@/lib/validation'

export interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
  disabled?: boolean
  error?: string
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10, // MB
  allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'],
  disabled = false,
  error,
}: FileUploadProps) {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const errors: string[] = []

      // Handle rejected files
      rejectedFiles.forEach((rejected) => {
        rejected.errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            errors.push(`${rejected.file.name}: File too large (max ${maxSize}MB)`)
          } else if (err.code === 'file-invalid-type') {
            errors.push(`${rejected.file.name}: File type not allowed`)
          } else if (err.code === 'too-many-files') {
            errors.push(`Too many files (max ${maxFiles})`)
          }
        })
      })

      // Validate accepted files
      const validFiles: File[] = []
      acceptedFiles.forEach((file) => {
        const validation = validateFile(file, allowedTypes, maxSize)
        if (validation.valid) {
          validFiles.push(file)
        } else {
          errors.push(`${file.name}: ${validation.error}`)
        }
      })

      // Check total file count
      const totalFiles = files.length + validFiles.length
      if (totalFiles > maxFiles) {
        const allowedNewFiles = maxFiles - files.length
        if (allowedNewFiles > 0) {
          validFiles.splice(allowedNewFiles)
          errors.push(`Only ${allowedNewFiles} more files allowed`)
        } else {
          errors.push(`Maximum ${maxFiles} files allowed`)
          validFiles.length = 0
        }
      }

      setValidationErrors(errors)
      
      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles])
      }
    },
    [files, maxFiles, maxSize, allowedTypes, onFilesChange]
  )

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
    setValidationErrors([])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    maxFiles: maxFiles - files.length,
    disabled,
  })

  const displayError = error || (validationErrors.length > 0 ? validationErrors[0] : undefined)

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          'hover:border-primary-400 hover:bg-primary-50',
          isDragActive && 'border-primary-500 bg-primary-50',
          disabled && 'cursor-not-allowed opacity-50',
          displayError && 'border-error-500',
          !displayError && 'border-gray-300'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              {isDragActive ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max {maxFiles} files, {maxSize}MB each. Allowed: {allowedTypes.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {isImageFile(file) ? (
                      <svg className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-error-500 hover:text-error-700 p-1"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 1 && (
        <div className="space-y-1">
          {validationErrors.slice(1).map((error, index) => (
            <p key={index} className="text-sm text-error-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Main Error */}
      {displayError && (
        <p className="text-sm text-error-600" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
