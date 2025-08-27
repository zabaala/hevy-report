import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/atoms/Card'
import Button from '../components/atoms/Button'
import DropZone from '../components/molecules/DropZone'
import EmptyState from '../components/molecules/EmptyState'
import { ImportResult } from '../services/csvImport'
import { useWorkoutStore } from '../store/workoutStore'
import { formatWeight } from '../utils/workoutCalculations'
import { db } from '../services/database'
import { WorkoutRecord } from '../types/workout'

const DataPage: React.FC = () => {
  const navigate = useNavigate()
  const { loadWorkouts, clearData } = useWorkoutStore()
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importedData, setImportedData] = useState<WorkoutRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    loadImportedData()
  }, [])

  const loadImportedData = async () => {
    setIsLoading(true)
    try {
      const data = await db.getAllWorkouts()
      setImportedData(data)
    } catch (error) {
      console.error('Error loading imported data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportComplete = async (result: ImportResult) => {
    setImportResult(result)
    
    if (result.success) {
      await loadImportedData()
      await loadWorkouts()
    }
  }

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all imported data?')) {
      try {
        await db.clearAllWorkouts()
        clearData()
        setImportedData([])
        setImportResult(null)
        setCurrentPage(1)
      } catch (error) {
        console.error('Error clearing data:', error)
      }
    }
  }

  const handleGoToReports = () => {
    navigate('/reports/workouts')
  }

  // Pagination
  const totalPages = Math.ceil(importedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = importedData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Show EmptyState when no data is imported */}
      {importedData.length === 0 && !isLoading && (
        <EmptyState onShowImport={() => setShowImport(true)} />
      )}

      {/* Show header and controls only when there is data or import section is visible */}
      {(importedData.length > 0 || showImport) && (
        <>
          {/* Header with title and buttons */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Data
              </h1>
              <p className="text-gray-600">
                Import and manage your Hevy workout data in CSV format
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowImport(!showImport)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  showImport
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showImport ? '✓ Import' : 'Import'}
              </button>
              {importedData.length > 0 && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleClearData}
                  className="text-error hover:text-error"
                >
                  Clear Data
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Import Section */}
      {showImport && (
        <Card title="Import CSV File">
          <DropZone onImportComplete={handleImportComplete} />
        
        {importResult && (
          <div className={`mt-4 p-4 rounded-md ${
            importResult.success 
              ? 'bg-success/20 border border-success/30' 
              : 'bg-error/20 border border-error/30'
          }`}>
            {importResult.success ? (
              <div>
                <p className="text-success font-medium">
                  ✓ Import completed successfully!
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {importResult.recordsImported} records imported from CSV
                </p>
                <div className="mt-3">
                  <Button onClick={handleGoToReports} size="sm">
                    View Reports
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-error font-medium">
                  ✗ Import error
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {importResult.error}
                </p>
              </div>
            )}
          </div>
        )}
        </Card>
      )}

      {/* Data Preview Section */}
      {importedData.length > 0 && (
        <Card title={`Imported Data (${importedData.length} records)`}>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading data...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">#</th>
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">Title</th>
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">Date/Time</th>
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">Exercise</th>
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">Set</th>
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">Weight (kg)</th>
                      <th className="text-left py-2 px-3 text-gray-900 font-medium">Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((record, index) => (
                      <tr key={record.id || index} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-gray-600">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-2 px-3 text-gray-900">{record.title}</td>
                        <td className="py-2 px-3 text-gray-600">
                          {new Date(record.start_time).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-2 px-3 text-gray-900">{record.exercise_title}</td>
                        <td className="py-2 px-3 text-gray-600">{record.set_index + 1}</td>
                        <td className="py-2 px-3 text-gray-900">
                          {record.weight_kg ? formatWeight(record.weight_kg) : '-'}
                        </td>
                        <td className="py-2 px-3 text-gray-900">
                          {record.reps ?? '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  {/* Page Size Selector */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="pageSize" className="text-sm text-gray-600">
                      Show:
                    </label>
                    <select
                      id="pageSize"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  )
}

export default DataPage
