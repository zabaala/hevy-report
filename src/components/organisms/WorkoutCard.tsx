import React, { useState } from 'react'
import ExerciseFilter from '../molecules/ExerciseFilter'
import { WorkoutSummary, ExerciseFilter as ExerciseFilterType } from '../../types/workout'
import { formatDate, getVolumeChangeColor, formatWeight, formatPercentage } from '../../utils/workoutCalculations'

interface WorkoutCardProps {
  workoutTitle: string
  summaries: WorkoutSummary[]
  exerciseFilters: ExerciseFilterType[]
  onExerciseFilterChange: (workoutTitle: string, filters: ExerciseFilterType[]) => void
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutTitle,
  summaries,
  exerciseFilters,
  onExerciseFilterChange
}) => {
  // State for exercise filter toggle
  const [showExerciseFilter, setShowExerciseFilter] = useState(false)
  // State for expanded rows (track by date)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  // Sort summaries by date (chronological order)
  const sortedSummaries = [...summaries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate exercise counters
  const exerciseFiltersWithCounters = exerciseFilters.map(filter => {
    // Count how many workouts contain this exercise
    const workoutCount = summaries.filter(summary => 
      summary.exercises.includes(filter.exerciseTitle)
    ).length
    
    return {
      ...filter,
      workoutCount,
      totalWorkouts: summaries.length
    }
  })

  // Toggle row expansion
  const toggleRowExpansion = (date: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(date)) {
      newExpandedRows.delete(date)
    } else {
      newExpandedRows.add(date)
    }
    setExpandedRows(newExpandedRows)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 print:break-inside-avoid">
      {/* Custom Header with Toggle Button and Stats */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{workoutTitle}</h3>
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span>{sortedSummaries.length} sessões</span>
            <span>•</span>
            <span>{sortedSummaries.length > 0 ? formatWeight(sortedSummaries.reduce((sum, s) => sum + s.totalVolume, 0) / sortedSummaries.length) : '0.00 kg'} médio</span>
          </div>
        </div>
        <button
          onClick={() => setShowExerciseFilter(!showExerciseFilter)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            showExerciseFilter
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showExerciseFilter ? '✓ Filtrar' : 'Filtrar'}
        </button>
      </div>

      <div className="space-y-0">
        {/* Exercise Filter */}
        {showExerciseFilter && (
          <div className="border-b border-gray-200 pb-4 px-6">
            <ExerciseFilter
              workoutTitle={workoutTitle}
              exercises={exerciseFiltersWithCounters}
              onFilterChange={onExerciseFilterChange}
            />
          </div>
        )}

        {/* Workout Sessions Table */}
        <div className="overflow-x-auto">
          {sortedSummaries.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>Nenhum dado encontrado para os filtros selecionados</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-xs">Data</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 text-xs">Sets</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 text-xs">Reps</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 text-xs">Volume</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 text-xs">Diff</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 text-xs">%</th>
                </tr>
              </thead>
              <tbody>
                {sortedSummaries.map((summary) => {
                  const isExpanded = expandedRows.has(summary.date)
                  return (
                    <React.Fragment key={`${summary.date}-${summary.title}`}>
                      {/* Main row */}
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(summary.date)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg 
                                className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div>
                              <div className="font-medium text-gray-900 text-xs">
                                ({summary.exercises.length}) {formatDate(summary.date)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-gray-900 text-xs">
                          {summary.totalSets}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-gray-900 text-xs">
                          {summary.totalReps}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900 text-xs">
                          {formatWeight(summary.totalVolume)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-xs">
                          {summary.volumeDiff !== 0 ? (
                            <span className={getVolumeChangeColor(summary.volumeDiff)}>
                              {summary.volumeDiff > 0 ? '+' : ''}{formatWeight(Math.abs(summary.volumeDiff))}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-xs">
                          {summary.volumeDiffPercent !== 0 ? (
                            <span className={getVolumeChangeColor(summary.volumeDiff)}>
                              {summary.volumeDiffPercent > 0 ? '+' : ''}{formatPercentage(Math.abs(summary.volumeDiffPercent))}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                      
                      {/* Expanded row with exercises */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="py-2 px-4 bg-gray-50">
                            <div className="text-xs text-gray-600 pl-6">
                              <span className="font-medium">Exercícios: </span>
                              {summary.exercises.join(', ')}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkoutCard
