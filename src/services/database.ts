import Dexie, { Table } from 'dexie'
import { WorkoutRecord } from '../types/workout'

export class WorkoutDatabase extends Dexie {
  workouts!: Table<WorkoutRecord>

  constructor() {
    super('WorkoutDatabase')
    this.version(1).stores({
      workouts: '++id, title, start_time, exercise_title'
    })
  }

  async clearAllWorkouts(): Promise<void> {
    console.log('Clearing all workout records...')
    await this.workouts.clear()
  }

  async importWorkouts(records: Omit<WorkoutRecord, 'id'>[]): Promise<number> {
    console.log(`Importing ${records.length} workout records...`)
    
    // Clear existing data (truncate + insert behavior)
    await this.clearAllWorkouts()
    
    // Insert new records
    await this.workouts.bulkAdd(records)
    
    const totalRecords = await this.workouts.count()
    console.log(`Import completed. Total records: ${totalRecords}`)
    
    return totalRecords
  }

  async getAllWorkouts(): Promise<WorkoutRecord[]> {
    return await this.workouts.orderBy('start_time').toArray()
  }

  async getWorkoutsByTitle(title: string): Promise<WorkoutRecord[]> {
    return await this.workouts.where('title').equals(title).toArray()
  }

  async getUniqueWorkoutTitles(): Promise<string[]> {
    const workouts = await this.workouts.toArray()
    const titles = [...new Set(workouts.map(w => w.title))]
    return titles.sort()
  }

  async getUniqueExercisesByWorkout(workoutTitle: string): Promise<string[]> {
    const workouts = await this.workouts.where('title').equals(workoutTitle).toArray()
    const exercises = [...new Set(workouts.map(w => w.exercise_title))]
    return exercises.sort()
  }
}

export const db = new WorkoutDatabase()
