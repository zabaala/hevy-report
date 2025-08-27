import React from 'react'
import Card from '../atoms/Card'
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
  // Sort summaries by date (chronological order)
  const sortedSummaries = [...summaries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <Card title={workoutTitle} className="print:break-inside-avoid">
      <div className="space-y-4">
        {/* Exercise Filter */}
        <div className="border-b border-dark-border pb-4">
          <ExerciseFilter
            workoutTitle={workoutTitle}
            exercises={exerciseFilters}
            onFilterChange={onExerciseFilterChange}
          />
        </div>

        {/* Workout Sessions */}
        <div className="space-y-3">
          {sortedSummaries.length === 0 ? (
            <div className="text-center py-8 text-dark-text-secondary">
              <p>Nenhum dado encontrado para os filtros selecionados</p>
            </div>
          ) : (
            sortedSummaries.map((summary) => (
              <div
                key={`${summary.date}-${summary.title}`}
                className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-dark-text">
                      {formatDate(summary.date)}
                    </h4>
                    <p className="text-sm text-dark-text-secondary">
                      {summary.exercises.length} exercício{summary.exercises.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-dark-text">
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
                    <div className="text-dark-text-secondary">Sets</div>
                    <div className="font-medium text-dark-text">{summary.totalSets}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-dark-text-secondary">Reps</div>
                    <div className="font-medium text-dark-text">{summary.totalReps}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-dark-text-secondary">Volume</div>
                    <div className="font-medium text-dark-text">
                      {summary.totalVolume.toFixed(1)} kg
                    </div>
                  </div>
                </div>

                {/* Exercise breakdown */}
                <div className="mt-3 pt-3 border-t border-dark-border/30">
                  <div className="text-xs text-dark-text-secondary">
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
          <div className="mt-6 pt-4 border-t border-dark-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-dark-text-secondary">Total de Sessões</div>
                <div className="font-bold text-dark-text text-lg">
                  {sortedSummaries.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-dark-text-secondary">Volume Médio</div>
                <div className="font-bold text-dark-text text-lg">
                  {(sortedSummaries.reduce((sum, s) => sum + s.totalVolume, 0) / sortedSummaries.length).toFixed(1)} kg
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default WorkoutCard
