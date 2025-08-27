import React from 'react'
import { formatPercentage } from '../../utils/workoutCalculations'

interface ProgressBarProps {
  progress: number // 0-100
  className?: string
  showPercentage?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = true 
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-dark-text-secondary">Progresso da importação</span>
        {showPercentage && (
          <span className="text-sm text-dark-text">{formatPercentage(clampedProgress)}</span>
        )}
      </div>
      <div className="w-full bg-dark-border rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
