import React from 'react'
import DropZone from './DropZone'
import { ImportResult } from '../../services/csvImport'

interface EmptyStateProps {
  onImportComplete: (result: ImportResult) => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ onImportComplete }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Empty State Card with DropZone */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No workout data found
          </h2>
          <p className="text-gray-600 mb-6">
            Import your Hevy workout data to start analyzing your training progress
          </p>
        </div>
        
        {/* Integrated DropZone */}
        <DropZone onImportComplete={onImportComplete} />
      </div>

      {/* Instructions Section */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Export from Hevy */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
            Export from Hevy
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900 mb-1">Option A: Hevy Mobile App</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open the Hevy app on your device</li>
                <li>Go to <strong>Settings</strong> → <strong>Export data</strong></li>
                <li>Select <strong>CSV format</strong></li>
                <li>Download the <code className="bg-gray-100 px-1 rounded">HEVY-workouts.csv</code> file</li>
              </ol>
            </div>
            <div className="pt-2">
              <p className="font-medium text-gray-900 mb-1">Option B: Hevy Web Platform</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Visit <a href="https://hevy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">hevy.com</a> and log in</li>
                <li>Navigate to <strong>Profile</strong> → <strong>Data Export</strong></li>
                <li>Request CSV export of your workout data</li>
                <li>Download when ready (usually within minutes)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Import to Hevy Report */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
            Import to Hevy Report
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the <strong>"Import CSV Data"</strong> button above</li>
              <li>Drag and drop your <code className="bg-gray-100 px-1 rounded">HEVY-workouts.csv</code> file</li>
              <li>Or click to browse and select the file</li>
              <li>Wait for the import to complete</li>
              <li>Navigate to <strong>Reports → Workouts</strong> to analyze your data</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-blue-800 text-xs">
                <strong>💡 Tip:</strong> The import process validates your data and shows progress. 
                Large files may take a few seconds to process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Structure Example */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Expected CSV Structure
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Your CSV file should contain the following columns. Here's an example based on Hevy's export format:
        </p>

        <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1 px-2 text-gray-700">title</th>
                <th className="text-left py-1 px-2 text-gray-700">start_time</th>
                <th className="text-left py-1 px-2 text-gray-700">exercise_title</th>
                <th className="text-left py-1 px-2 text-gray-700">set_index</th>
                <th className="text-left py-1 px-2 text-gray-700">weight_kg</th>
                <th className="text-left py-1 px-2 text-gray-700">reps</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2">Push Day A</td>
                <td className="py-1 px-2">27 Aug 2025, 07:20</td>
                <td className="py-1 px-2">Bench Press</td>
                <td className="py-1 px-2">0</td>
                <td className="py-1 px-2">80.0</td>
                <td className="py-1 px-2">12</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2">Push Day A</td>
                <td className="py-1 px-2">27 Aug 2025, 07:20</td>
                <td className="py-1 px-2">Bench Press</td>
                <td className="py-1 px-2">1</td>
                <td className="py-1 px-2">85.0</td>
                <td className="py-1 px-2">10</td>
              </tr>
              <tr>
                <td className="py-1 px-2">Push Day A</td>
                <td className="py-1 px-2">27 Aug 2025, 07:20</td>
                <td className="py-1 px-2">Shoulder Press</td>
                <td className="py-1 px-2">0</td>
                <td className="py-1 px-2">25.0</td>
                <td className="py-1 px-2">15</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
            <ul className="space-y-1 text-gray-600">
              <li><code className="bg-gray-100 px-1 rounded">title</code> - Workout name</li>
              <li><code className="bg-gray-100 px-1 rounded">start_time</code> - Date and time</li>
              <li><code className="bg-gray-100 px-1 rounded">exercise_title</code> - Exercise name</li>
              <li><code className="bg-gray-100 px-1 rounded">set_index</code> - Set number (0-based)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Optional Columns:</h4>
            <ul className="space-y-1 text-gray-600">
              <li><code className="bg-gray-100 px-1 rounded">weight_kg</code> - Weight in kilograms</li>
              <li><code className="bg-gray-100 px-1 rounded">reps</code> - Number of repetitions</li>
              <li><code className="bg-gray-100 px-1 rounded">distance_km</code> - Distance (cardio)</li>
              <li><code className="bg-gray-100 px-1 rounded">duration_seconds</code> - Duration</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>⚠️ Note:</strong> Make sure your CSV uses comma separators and includes column headers. 
            The application will validate the structure during import and show detailed error messages if needed.
          </p>
        </div>
      </div>

      {/* Additional Help */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📱 Mobile App Issues</h4>
            <p className="text-gray-600">
              If you can't find the export option in the mobile app, try updating to the latest version or use the web platform.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🌐 Web Platform</h4>
            <p className="text-gray-600">
              The web platform at hevy.com usually provides the most reliable export functionality with detailed options.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📊 Custom Data</h4>
            <p className="text-gray-600">
              You can create your own CSV following the structure above if you want to import data from other sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyState
