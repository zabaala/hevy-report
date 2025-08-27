import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import WorkoutCard from '../components/organisms/WorkoutCard'
import Button from '../components/atoms/Button'
import { calculateWorkoutSummaries, formatWeight } from '../utils/workoutCalculations'

const WorkoutReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const [showWorkoutFilter, setShowWorkoutFilter] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  
  const { 
    workouts, 
    isLoading, 
    error, 
    filters, 
    loadWorkouts, 
    updateExerciseFilters,
    updateFilters 
  } = useWorkoutStore()

  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts])

  // Filter workouts by selected workout titles and date range
  const filteredWorkouts = useMemo(() => {
    let filtered = workouts

    // Filter by selected workout titles
    if (filters.selectedWorkouts.length > 0) {
      filtered = filtered.filter(workout => 
        filters.selectedWorkouts.includes(workout.title)
      )
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(workout => {
        const workoutDate = new Date(workout.start_time).toISOString().split('T')[0]
        
        if (startDate && workoutDate < startDate) return false
        if (endDate && workoutDate > endDate) return false
        
        return true
      })
    }

    return filtered
  }, [workouts, filters.selectedWorkouts, startDate, endDate])

  // Convert exercise filters to the format expected by calculations
  const selectedExercises = useMemo(() => {
    const result: Record<string, string[]> = {}
    Object.entries(filters.exerciseFilters).forEach(([workoutTitle, exerciseFilters]) => {
      result[workoutTitle] = exerciseFilters
        .filter(filter => filter.selected)
        .map(filter => filter.exerciseTitle)
    })
    return result
  }, [filters.exerciseFilters])

  // Calculate workout summaries
  const workoutSummaries = useMemo(() => {
    return calculateWorkoutSummaries(filteredWorkouts, selectedExercises)
  }, [filteredWorkouts, selectedExercises])

  // Get unique workout titles sorted alphabetically
  const workoutTitles = useMemo(() => {
    return Object.keys(workoutSummaries).sort()
  }, [workoutSummaries])

  // Get all available workout titles from raw data
  const allWorkoutTitles = useMemo(() => {
    const titles = Array.from(new Set(workouts.map(w => w.title))).sort()
    return titles
  }, [workouts])

  // Initialize workout filters if empty (all selected by default)
  useEffect(() => {
    if (allWorkoutTitles.length > 0 && filters.selectedWorkouts.length === 0) {
      updateFilters({ selectedWorkouts: allWorkoutTitles })
    }
  }, [allWorkoutTitles, filters.selectedWorkouts.length, updateFilters])

  const handleExerciseFilterChange = (workoutTitle: string, exerciseFilters: { exerciseTitle: string; selected: boolean }[]) => {
    updateExerciseFilters(workoutTitle, exerciseFilters)
  }

  const handleWorkoutFilterChange = (selectedTitles: string[]) => {
    updateFilters({ selectedWorkouts: selectedTitles })
  }

  const handleSelectAllWorkouts = () => {
    const allSelected = filters.selectedWorkouts.length === allWorkoutTitles.length
    updateFilters({ selectedWorkouts: allSelected ? [] : allWorkoutTitles })
  }

  const handleGoToImport = () => {
    navigate('/data')
  }

  const handleClearDateFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-gray-900 mb-2">Loading data...</div>
          <div className="text-gray-600">
            Please wait while we load your workouts
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-error mb-2">Error loading data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button onClick={handleGoToImport} variant="primary">
            Go to Data
          </Button>
        </div>
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-dark-text mb-2">No data found</div>
          <div className="text-dark-text-secondary mb-6">
            Import your workout data to start viewing reports
          </div>
          <Button onClick={handleGoToImport} variant="primary">
            Import Data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout Report
          </h1>
          <p className="text-gray-600">
            Volume analysis and evolution of your workouts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {(startDate || endDate) && (
              <button
                onClick={handleClearDateFilter}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                title="Clear date filter"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Workout Filter Toggle */}
          <button
            onClick={() => setShowWorkoutFilter(!showWorkoutFilter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showWorkoutFilter
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showWorkoutFilter ? '✓ Filter' : 'Filter'}
          </button>
        </div>
      </div>

      {/* Workout Filter */}
      {showWorkoutFilter && allWorkoutTitles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Workouts</h3>
            <button
              onClick={handleSelectAllWorkouts}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              {filters.selectedWorkouts.length === allWorkoutTitles.length 
                ? 'Deselect All' 
                : 'Select All'
              }
            </button>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {filters.selectedWorkouts.length} of {allWorkoutTitles.length} workouts selected
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allWorkoutTitles.map((title) => (
              <label
                key={title}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedWorkouts.includes(title)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleWorkoutFilterChange([...filters.selectedWorkouts, title])
                    } else {
                      handleWorkoutFilterChange(filters.selectedWorkouts.filter(t => t !== title))
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-900 truncate">
                  {title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {workouts.length}
          </div>
          <div className="text-gray-600 text-sm">
            Total Sets
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {workoutTitles.length}
          </div>
          <div className="text-gray-600 text-sm">
            Workout Types
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Object.values(workoutSummaries).reduce((sum, summaries) => sum + summaries.length, 0)}
          </div>
          <div className="text-gray-600 text-sm">
            Training Sessions
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatWeight(Object.values(workoutSummaries)
              .flat()
              .reduce((sum, summary) => sum + summary.totalVolume, 0))}
          </div>
          <div className="text-gray-600 text-sm">
            Total Volume
          </div>
        </div>
      </div>

      {/* Workout Cards */}
      {workoutTitles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg text-dark-text mb-2">
            No workouts found with current filters
          </div>
          <div className="text-dark-text-secondary">
            Adjust filters or import new data
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workoutTitles.map((workoutTitle) => (
            <WorkoutCard
              key={workoutTitle}
              workoutTitle={workoutTitle}
              summaries={workoutSummaries[workoutTitle] || []}
              exerciseFilters={filters.exerciseFilters[workoutTitle] || []}
              onExerciseFilterChange={handleExerciseFilterChange}
            />
          ))}
        </div>
      )}

      {/* Print-only footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
        <p>Hevy Report - Workout Report generated on {new Date().toLocaleDateString('en-US')}</p>
      </div>
    </div>
  )
}

export default WorkoutReportsPage
