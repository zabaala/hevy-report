import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation: React.FC = () => {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  const linkClasses = (path: string) => 
    `px-4 py-2 rounded-md transition-colors duration-200 ${
      isActive(path) 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-100'
    }`
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              Hevy Report
            </h1>
            <div className="flex space-x-2">
              <Link to="/import" className={linkClasses('/import')}>
                Importação
              </Link>
              <Link to="/dashboard" className={linkClasses('/dashboard')}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
