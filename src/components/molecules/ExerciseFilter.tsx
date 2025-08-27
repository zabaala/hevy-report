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
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-dark-text">
          Filtrar Exercícios
        </h4>
        <button
          onClick={handleSelectAll}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          {allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>
      
      <div className="text-xs text-dark-text-secondary mb-2">
        {selectedCount} de {exercises.length} exercícios selecionados
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {exercises.map((exercise) => (
          <label
            key={exercise.exerciseTitle}
            className="flex items-center space-x-2 cursor-pointer hover:bg-dark-border/20 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={exercise.selected}
              onChange={() => handleToggle(exercise.exerciseTitle)}
              className="w-4 h-4 text-blue-600 bg-dark-surface border-dark-border rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-dark-text truncate">
              {exercise.exerciseTitle}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default ExerciseFilter
