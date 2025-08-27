import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/atoms/Card'
import Button from '../components/atoms/Button'
import DropZone from '../components/molecules/DropZone'
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

  const itemsPerPage = 10

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
  const totalPages = Math.ceil(importedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = importedData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data
        </h1>
        <p className="text-gray-600">
          Import and manage your Hevy workout data in CSV format
        </p>
      </div>

      {/* Import Section */}
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

      {/* Data Preview Section */}
      {importedData.length > 0 && (
        <Card title={`Imported Data (${importedData.length} records)`}>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              View of imported data with pagination
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleClearData}
              className="text-error hover:text-error"
            >
              Clear Data
            </Button>
          </div>

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
                <div className="flex justify-center items-center mt-6 space-x-2">
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
              )}
            </>
          )}
        </Card>
      )}
    </div>
  )
}

export default DataPage
