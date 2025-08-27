import { Routes, Route, Navigate } from 'react-router-dom'
import DataPage from './pages/DataPage'
import WorkoutReportsPage from './pages/WorkoutReportsPage'
import Navigation from './components/molecules/Navigation'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/data" replace />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/reports/workouts" element={<WorkoutReportsPage />} />
          {/* Legacy redirects */}
          <Route path="/import" element={<Navigate to="/data" replace />} />
          <Route path="/dashboard" element={<Navigate to="/reports/workouts" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
