import React, { useState } from 'react'
import ExerciseFilter from '../molecules/ExerciseFilter'
import { WorkoutSummary, ExerciseFilter as ExerciseFilterType } from '../../types/workout'
import { formatDate, getVolumeChangeColor, formatVolumeDiff } from '../../utils/workoutCalculations'

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 print:break-inside-avoid">
      {/* Custom Header with Toggle Button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{workoutTitle}</h3>
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

      <div className="p-6 space-y-4">
        {/* Exercise Filter */}
        {showExerciseFilter && (
          <div className="border-b border-gray-200 pb-4">
            <ExerciseFilter
              workoutTitle={workoutTitle}
              exercises={exerciseFiltersWithCounters}
              onFilterChange={onExerciseFilterChange}
            />
          </div>
        )}

        {/* Workout Sessions */}
        <div className="space-y-3">
          {sortedSummaries.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>Nenhum dado encontrado para os filtros selecionados</p>
            </div>
          ) : (
            sortedSummaries.map((summary) => (
              <div
                key={`${summary.date}-${summary.title}`}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {formatDate(summary.date)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {summary.exercises.length} exercício{summary.exercises.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {summary.totalVolume.toFixed(1)} kg
                    </div>
                    {summary.volumeDiff !== 0 && (
                      <div className={`text-sm font-medium ${getVolumeChangeColor(summary.volumeDiff)}`}>
                        {formatVolumeDiff(summary.volumeDiff, summary.volumeDiffPercent)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600">Sets</div>
                    <div className="font-medium text-gray-900">{summary.totalSets}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Reps</div>
                    <div className="font-medium text-gray-900">{summary.totalReps}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Volume</div>
                    <div className="font-medium text-gray-900">
                      {summary.totalVolume.toFixed(1)} kg
                    </div>
                  </div>
                </div>

                {/* Exercise breakdown */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Exercícios: </span>
                    {summary.exercises.join(', ')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary stats */}
        {sortedSummaries.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-600">Total de Sessões</div>
                <div className="font-bold text-gray-900 text-lg">
                  {sortedSummaries.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Volume Médio</div>
                <div className="font-bold text-gray-900 text-lg">
                  {(sortedSummaries.reduce((sum, s) => sum + s.totalVolume, 0) / sortedSummaries.length).toFixed(1)} kg
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutCard
