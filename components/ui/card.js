import React from "react"

export function Card({ className = "", children, ...props }) {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div 
      className={`p-6 pb-2 flex flex-col space-y-1.5 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3 
      className={`font-semibold text-lg leading-none tracking-tight ${className}`} 
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className = "", children, ...props }) {
  return (
    <p 
      className={`text-sm text-gray-500 ${className}`} 
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div 
      className={`p-6 pt-0 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className = "", children, ...props }) {
  return (
    <div 
      className={`p-6 pt-0 flex items-center ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}
