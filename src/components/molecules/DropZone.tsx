import React, { useCallback, useState } from 'react'
import { CSVImportService, ImportProgress, ImportResult } from '../../services/csvImport'
import ProgressBar from '../atoms/ProgressBar'

interface DropZoneProps {
  onImportComplete: (result: ImportResult) => void
}

const DropZone: React.FC<DropZoneProps> = ({ onImportComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState<ImportProgress | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'))

    if (!csvFile) {
      onImportComplete({
        success: false,
        recordsImported: 0,
        error: 'Please select a valid CSV file'
      })
      return
    }

    await processFile(csvFile)
  }, [onImportComplete])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      onImportComplete({
        success: false,
        recordsImported: 0,
        error: 'Please select a valid CSV file'
      })
      return
    }

    await processFile(file)
  }, [onImportComplete])

  const processFile = async (file: File) => {
    setIsImporting(true)
    setProgress(null)

    try {
      const result = await CSVImportService.importFromFile(file, (progressData) => {
        setProgress(progressData)
      })

      onImportComplete(result)
    } catch (error) {
      onImportComplete({
        success: false,
        recordsImported: 0,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setIsImporting(false)
      setProgress(null)
    }
  }

  if (isImporting) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="mb-4">
          <div className="text-lg font-medium text-gray-900 mb-2">
            Importing CSV file...
          </div>
          <div className="text-sm text-gray-600">
            Please wait while we process your data
          </div>
        </div>
        {progress && (
          <ProgressBar 
            progress={progress.percentage} 
            className="max-w-md mx-auto"
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className="mb-4">
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drag and drop your CSV file here
        </p>
        <p className="text-sm text-gray-600">
          or click to select a file
        </p>
      </div>

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-file-input"
        />
        <label htmlFor="csv-file-input">
          <span className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Select CSV File
          </span>
        </label>
      </div>

      <div className="text-xs text-gray-500">
        Accepted formats: .csv
      </div>
    </div>
  )
}

export default DropZone
