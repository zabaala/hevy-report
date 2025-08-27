import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import WorkoutCard from '../components/organisms/WorkoutCard'
import Button from '../components/atoms/Button'
import { calculateWorkoutSummaries, formatWeight } from '../utils/workoutCalculations'

const WorkoutReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const [showWorkoutFilter, setShowWorkoutFilter] = useState(false)
  
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

  // Filter workouts by selected workout titles
  const filteredWorkouts = useMemo(() => {
    if (filters.selectedWorkouts.length === 0) return workouts
    return workouts.filter(workout => 
      filters.selectedWorkouts.includes(workout.title)
    )
  }, [workouts, filters.selectedWorkouts])

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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-gray-900 mb-2">Carregando dados...</div>
          <div className="text-gray-600">
            Por favor, aguarde enquanto carregamos seus treinos
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-error mb-2">Erro ao carregar dados</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button onClick={handleGoToImport} variant="primary">
            Ir para Dados
          </Button>
        </div>
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-dark-text mb-2">Nenhum dado encontrado</div>
          <div className="text-dark-text-secondary mb-6">
            Importe seus dados de treino para começar a visualizar relatórios
          </div>
          <Button onClick={handleGoToImport} variant="primary">
            Importar Dados
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
            Dashboard de Treinos
          </h1>
          <p className="text-gray-600">
            Análise de volume e evolução dos seus treinos
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowWorkoutFilter(!showWorkoutFilter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showWorkoutFilter
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showWorkoutFilter ? '✓ Filtrar' : 'Filtrar'}
          </button>
        </div>
      </div>

      {/* Workout Filter */}
      {showWorkoutFilter && allWorkoutTitles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtrar Treinos</h3>
            <button
              onClick={handleSelectAllWorkouts}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              {filters.selectedWorkouts.length === allWorkoutTitles.length 
                ? 'Desmarcar Todos' 
                : 'Selecionar Todos'
              }
            </button>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {filters.selectedWorkouts.length} de {allWorkoutTitles.length} treinos selecionados
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
            Total de Sets
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {workoutTitles.length}
          </div>
          <div className="text-gray-600 text-sm">
            Tipos de Treino
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Object.values(workoutSummaries).reduce((sum, summaries) => sum + summaries.length, 0)}
          </div>
          <div className="text-gray-600 text-sm">
            Sessões de Treino
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatWeight(Object.values(workoutSummaries)
              .flat()
              .reduce((sum, summary) => sum + summary.totalVolume, 0))}
          </div>
          <div className="text-gray-600 text-sm">
            Volume Total
          </div>
        </div>
      </div>

      {/* Workout Cards */}
      {workoutTitles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg text-dark-text mb-2">
            Nenhum treino encontrado com os filtros atuais
          </div>
          <div className="text-dark-text-secondary">
            Ajuste os filtros ou importe novos dados
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
        <p>Hevy Report - Relatório de Treinos gerado em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  )
}

export default WorkoutReportsPage
