import { Routes, Route, Navigate } from 'react-router-dom'
import ImportPage from './pages/ImportPage'
import DashboardPage from './pages/DashboardPage'
import Navigation from './components/molecules/Navigation'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/import" replace />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
