import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation: React.FC = () => {
  const location = useLocation()
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  
  const isActive = (path: string) => location.pathname === path
  const isReportsActive = () => location.pathname.startsWith('/reports')
  
  const linkClasses = (path: string) => 
    `px-4 py-2 rounded-md transition-colors duration-200 ${
      isActive(path) 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 hover:bg-gray-100'
    }`

  const dropdownLinkClasses = (path: string) => 
    `block px-4 py-2 text-sm transition-colors duration-200 ${
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
              <Link to="/data" className={linkClasses('/data')}>
                Dados
              </Link>
              
              {/* Relatórios Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsReportsOpen(!isReportsOpen)}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-1 ${
                    isReportsActive() 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>Relatórios</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isReportsOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isReportsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link 
                        to="/reports/workouts" 
                        className={dropdownLinkClasses('/reports/workouts')}
                        onClick={() => setIsReportsOpen(false)}
                      >
                        Treinos
                      </Link>
                      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 mt-1">
                        Mais relatórios em breve...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
