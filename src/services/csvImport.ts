import Papa from 'papaparse'
import { WorkoutRecord } from '../types/workout'
import { db } from './database'

export interface ImportProgress {
  current: number
  total: number
  percentage: number
}

export interface ImportResult {
  success: boolean
  recordsImported: number
  error?: string
}

export class CSVImportService {
  static async importFromFile(
    file: File,
    _onProgress?: (progress: ImportProgress) => void
  ): Promise<ImportResult> {
    try {
      console.log('Starting CSV import from file:', file.name)
      
      return new Promise((resolve) => {
        // Try reading file as text first to debug
        const reader = new FileReader()
        reader.onload = (e) => {
          const csvText = e.target?.result as string
          console.log('File content preview:', csvText.substring(0, 500))
          console.log('File size:', csvText.length, 'characters')
          
          // Now parse with Papa Parse
          Papa.parse<WorkoutRecord>(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header: string) => header.trim(),
            complete: async (results) => {
            try {
              console.log('CSV parsing completed. Results:', {
                errorsCount: results.errors.length,
                dataLength: results.data?.length || 0,
                firstRow: results.data?.[0],
                meta: results.meta
              })

              if (results.errors.length > 0) {
                console.error('CSV parsing errors:', results.errors)
                resolve({
                  success: false,
                  recordsImported: 0,
                  error: `Erro ao processar CSV: ${results.errors[0].message}`
                })
                return
              }

              if (!results.data || results.data.length === 0) {
                console.error('CSV data is empty or invalid:', { 
                  hasData: !!results.data, 
                  dataLength: results.data?.length,
                  dataType: typeof results.data 
                })
                resolve({
                  success: false,
                  recordsImported: 0,
                  error: 'CSV file is empty or does not contain valid data'
                })
                return
              }

              // Transform data after parsing
              const transformedData = results.data.map((row: any) => {
                const transformedRow = { ...row }
                
                // Transform numeric fields
                const numericFields = ['set_index', 'weight_kg', 'reps', 'distance_km', 'duration_seconds', 'rpe']
                numericFields.forEach(field => {
                  if (transformedRow[field] !== undefined && transformedRow[field] !== '') {
                    const numValue = parseFloat(transformedRow[field])
                    transformedRow[field] = isNaN(numValue) ? null : numValue
                  } else {
                    transformedRow[field] = null
                  }
                })
                
                // Trim string fields
                Object.keys(transformedRow).forEach(key => {
                  if (typeof transformedRow[key] === 'string') {
                    transformedRow[key] = transformedRow[key].trim()
                  }
                })
                
                return transformedRow
              })

              // Validate required fields
              const requiredFields = ['title', 'start_time', 'exercise_title']
              const firstRow = transformedData[0]
              const missingFields = requiredFields.filter(field => !(field in firstRow))
              
              if (missingFields.length > 0) {
                resolve({
                  success: false,
                  recordsImported: 0,
                  error: `Required fields missing in CSV: ${missingFields.join(', ')}`
                })
                return
              }

              console.log('Transformed data sample:', transformedData[0])

              // Import to database
              const recordsImported = await db.importWorkouts(transformedData)
              
              resolve({
                success: true,
                recordsImported,
              })
            } catch (error) {
              console.error('Error importing to database:', error)
              resolve({
                success: false,
                recordsImported: 0,
                error: `Error saving to database: ${error instanceof Error ? error.message : 'Unknown error'}`
              })
            }
          },
          error: (error: any) => {
            console.error('Papa Parse error:', error)
            resolve({
              success: false,
              recordsImported: 0,
              error: `Error processing CSV file: ${error.message || 'Unknown error'}`
            })
          }
        })
        }
        
        reader.onerror = () => {
          resolve({
            success: false,
            recordsImported: 0,
            error: 'Error reading file'
          })
        }
        
        reader.readAsText(file)
      })
    } catch (error) {
      console.error('CSV import error:', error)
      return {
        success: false,
        recordsImported: 0,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}
