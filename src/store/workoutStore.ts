import { create } from 'zustand'
import { WorkoutRecord, WorkoutFilters } from '../types/workout'
import { db } from '../services/database'

interface WorkoutState {
  workouts: WorkoutRecord[]
  isLoading: boolean
  error: string | null
  filters: WorkoutFilters
  
  // Actions
  loadWorkouts: () => Promise<void>
  setWorkouts: (workouts: WorkoutRecord[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateFilters: (filters: Partial<WorkoutFilters>) => void
  updateExerciseFilters: (workoutTitle: string, exerciseFilters: { exerciseTitle: string; selected: boolean }[]) => void
  clearData: () => void
}

// LocalStorage keys
const FILTERS_STORAGE_KEY = 'hevy-report-filters'

// Load filters from localStorage
const loadFiltersFromStorage = (): WorkoutFilters => {
  try {
    const stored = localStorage.getItem(FILTERS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load filters from localStorage:', error)
  }
  
  return {
    selectedWorkouts: [],
    exerciseFilters: {}
  }
}

// Save filters to localStorage
const saveFiltersToStorage = (filters: WorkoutFilters) => {
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters))
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error)
  }
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  isLoading: false,
  error: null,
  filters: loadFiltersFromStorage(),

  loadWorkouts: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const workouts = await db.getAllWorkouts()
      const uniqueTitles = [...new Set(workouts.map(w => w.title))].sort()
      
      const currentFilters = get().filters
      
      // Initialize filters if empty
      if (currentFilters.selectedWorkouts.length === 0) {
        const newFilters: WorkoutFilters = {
          selectedWorkouts: uniqueTitles,
          exerciseFilters: {}
        }
        
        // Initialize exercise filters for each workout
        for (const title of uniqueTitles) {
          const exercises = await db.getUniqueExercisesByWorkout(title)
          newFilters.exerciseFilters[title] = exercises.map(exercise => ({
            exerciseTitle: exercise,
            selected: true
          }))
        }
        
        set({ filters: newFilters })
        saveFiltersToStorage(newFilters)
      }
      
      set({ workouts, isLoading: false })
    } catch (error) {
      console.error('Failed to load workouts:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar treinos',
        isLoading: false 
      })
    }
  },

  setWorkouts: (workouts) => {
    set({ workouts })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  setError: (error) => {
    set({ error })
  },

  updateFilters: (newFilters) => {
    const currentFilters = get().filters
    const updatedFilters = { ...currentFilters, ...newFilters }
    set({ filters: updatedFilters })
    saveFiltersToStorage(updatedFilters)
  },

  updateExerciseFilters: (workoutTitle, exerciseFilters) => {
    const currentFilters = get().filters
    const updatedFilters = {
      ...currentFilters,
      exerciseFilters: {
        ...currentFilters.exerciseFilters,
        [workoutTitle]: exerciseFilters
      }
    }
    set({ filters: updatedFilters })
    saveFiltersToStorage(updatedFilters)
  },

  clearData: () => {
    set({ 
      workouts: [], 
      error: null,
      filters: {
        selectedWorkouts: [],
        exerciseFilters: {}
      }
    })
    localStorage.removeItem(FILTERS_STORAGE_KEY)
  }
}))
