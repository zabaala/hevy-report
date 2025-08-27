import { WorkoutRecord, WorkoutSummary } from '../types/workout'

export const calculateSetVolume = (reps: number | null, weight: number | null): number => {
  const actualReps = reps ?? 1
  const actualWeight = weight ?? 0
  return actualReps * actualWeight
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

export const formatDateOnly = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

export const groupWorkoutsByDateAndTitle = (
  workouts: WorkoutRecord[],
  selectedExercises: Record<string, string[]> = {}
): Record<string, Record<string, WorkoutRecord[]>> => {
  const grouped: Record<string, Record<string, WorkoutRecord[]>> = {}

  workouts.forEach(workout => {
    const dateKey = formatDateOnly(workout.start_time)
    const titleKey = workout.title

    // Filter by selected exercises if specified
    const selectedForWorkout = selectedExercises[titleKey]
    if (selectedForWorkout && selectedForWorkout.length > 0 && !selectedForWorkout.includes(workout.exercise_title)) {
      return
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = {}
    }
    if (!grouped[dateKey][titleKey]) {
      grouped[dateKey][titleKey] = []
    }

    grouped[dateKey][titleKey].push(workout)
  })

  return grouped
}

export const calculateWorkoutSummaries = (
  workouts: WorkoutRecord[],
  selectedExercises: Record<string, string[]> = {}
): Record<string, WorkoutSummary[]> => {
  const grouped = groupWorkoutsByDateAndTitle(workouts, selectedExercises)
  const summaries: Record<string, WorkoutSummary[]> = {}

  // First pass: calculate basic metrics for each date/title combination
  const workoutsByTitle: Record<string, WorkoutSummary[]> = {}

  Object.entries(grouped).forEach(([date, titleGroups]) => {
    Object.entries(titleGroups).forEach(([title, records]) => {
      const totalSets = records.length
      const totalReps = records.reduce((sum, record) => sum + (record.reps ?? 1), 0)
      const totalVolume = records.reduce((sum, record) => 
        sum + calculateSetVolume(record.reps, record.weight_kg), 0
      )
      const exercises = [...new Set(records.map(r => r.exercise_title))]

      const summary: WorkoutSummary = {
        title,
        date,
        totalSets,
        totalReps,
        totalVolume,
        volumeDiff: 0,
        volumeDiffPercent: 0,
        exercises
      }

      if (!workoutsByTitle[title]) {
        workoutsByTitle[title] = []
      }
      workoutsByTitle[title].push(summary)
    })
  })

  // Second pass: calculate differences
  Object.entries(workoutsByTitle).forEach(([title, titleSummaries]) => {
    // Sort by date
    titleSummaries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    titleSummaries.forEach((summary, index) => {
      if (index > 0) {
        const previousSummary = titleSummaries[index - 1]
        summary.volumeDiff = summary.totalVolume - previousSummary.totalVolume
        
        if (previousSummary.totalVolume > 0) {
          summary.volumeDiffPercent = (summary.volumeDiff / previousSummary.totalVolume) * 100
        } else {
          summary.volumeDiffPercent = 0
        }
      }
    })

    summaries[title] = titleSummaries
  })

  return summaries
}

export const getVolumeChangeColor = (diff: number): string => {
  if (diff > 0) return 'text-success'
  if (diff < 0) return 'text-error'
  return 'text-dark-text'
}

export const formatVolumeDiff = (diff: number, percent: number): string => {
  const sign = diff >= 0 ? '+' : ''
  const formattedWeight = formatWeight(Math.abs(diff))
  const formattedPercent = formatPercentage(Math.abs(percent))
  return `${sign}${formattedWeight} (${sign}${formattedPercent})`
}

// Format weight values with thousands separator and kg suffix
export const formatWeight = (value: number): string => {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kg'
}

// Format percentage values with 2 decimal places
export const formatPercentage = (value: number): string => {
  return value.toFixed(2) + '%'
}

// Format numbers with thousands separator (no suffix)
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
