import React from 'react'
import { ExerciseFilter as ExerciseFilterType } from '../../types/workout'

interface ExerciseFilterProps {
  workoutTitle: string
  exercises: ExerciseFilterType[]
  onFilterChange: (workoutTitle: string, exercises: ExerciseFilterType[]) => void
}

const ExerciseFilter: React.FC<ExerciseFilterProps> = ({
  workoutTitle,
  exercises,
  onFilterChange
}) => {
  const handleToggle = (exerciseTitle: string) => {
    const updatedExercises = exercises.map(exercise =>
      exercise.exerciseTitle === exerciseTitle
        ? { ...exercise, selected: !exercise.selected }
        : exercise
    )
    onFilterChange(workoutTitle, updatedExercises)
  }

  const handleSelectAll = () => {
    const allSelected = exercises.every(exercise => exercise.selected)
    const updatedExercises = exercises.map(exercise => ({
      ...exercise,
      selected: !allSelected
    }))
    onFilterChange(workoutTitle, updatedExercises)
  }

  const selectedCount = exercises.filter(exercise => exercise.selected).length
  const allSelected = selectedCount === exercises.length

  return (
    <div className="space-y-3">
      {/* Header with select all button */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          {selectedCount} de {exercises.length} exercícios selecionados
        </div>
        <button
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:text-blue-500 transition-colors"
        >
          {allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>

      {/* Exercise list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {exercises.map((exercise) => (
          <label
            key={exercise.exerciseTitle}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={exercise.selected}
                onChange={() => handleToggle(exercise.exerciseTitle)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-900 truncate">
                {exercise.exerciseTitle}
              </span>
            </div>
            
            {/* Counter display */}
            {exercise.workoutCount !== undefined && exercise.totalWorkouts !== undefined && (
              <span className="text-xs text-gray-500 font-mono ml-2 flex-shrink-0">
                {exercise.workoutCount}/{exercise.totalWorkouts}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

export default ExerciseFilter
