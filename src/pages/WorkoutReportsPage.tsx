import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import WorkoutCard from '../components/organisms/WorkoutCard'
import Button from '../components/atoms/Button'
import { calculateWorkoutSummaries } from '../utils/workoutCalculations'

const WorkoutReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const { 
    workouts, 
    isLoading, 
    error, 
    filters, 
    loadWorkouts, 
    updateExerciseFilters 
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

  const handleExerciseFilterChange = (workoutTitle: string, exerciseFilters: { exerciseTitle: string; selected: boolean }[]) => {
    updateExerciseFilters(workoutTitle, exerciseFilters)
  }

  const handleGoToImport = () => {
    navigate('/import')
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-lg text-dark-text mb-2">Carregando dados...</div>
          <div className="text-dark-text-secondary">
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
          <div className="text-dark-text-secondary mb-4">{error}</div>
          <Button onClick={handleGoToImport} variant="primary">
            Ir para Importação
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
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Dashboard de Treinos
          </h1>
          <p className="text-dark-text-secondary">
            Análise de volume e evolução dos seus treinos
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={handlePrint}
            className="print:hidden"
          >
            🖨️ Imprimir
          </Button>
          <Button variant="secondary" onClick={handleGoToImport}>
            📁 Importar Dados
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-dark-text">
            {workouts.length}
          </div>
          <div className="text-dark-text-secondary text-sm">
            Total de Sets
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-dark-text">
            {workoutTitles.length}
          </div>
          <div className="text-dark-text-secondary text-sm">
            Tipos de Treino
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-dark-text">
            {Object.values(workoutSummaries).reduce((sum, summaries) => sum + summaries.length, 0)}
          </div>
          <div className="text-dark-text-secondary text-sm">
            Sessões de Treino
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-dark-text">
            {Object.values(workoutSummaries)
              .flat()
              .reduce((sum, summary) => sum + summary.totalVolume, 0)
              .toFixed(0)} kg
          </div>
          <div className="text-dark-text-secondary text-sm">
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
