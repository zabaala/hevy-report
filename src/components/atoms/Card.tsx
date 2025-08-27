import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-dark-text mb-4 border-b border-dark-border pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default Card
