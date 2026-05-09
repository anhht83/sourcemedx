'use client'

import React, { useState, useRef, useEffect } from 'react'

interface IResizablePanelProps {
  children?: React.ReactNode
}

export function ResizablePanel({ children }: IResizablePanelProps) {
  const [width, setWidth] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)

  useEffect(() => {
    const storedWidth = localStorage.getItem('sidebarWidth')
    if (storedWidth) {
      setWidth(Number(storedWidth))
    } else {
      // Default width for desktop
      setWidth(320)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarWidth', String(width))
    }
  }, [width])

  const handleMouseDown = () => {
    isResizing.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        const newWidth = Math.min(550, Math.max(250, e.clientX)) // Minimum width: 250px
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      isResizing.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={sidebarRef}
      className="h-screen relative w-1/4 min-w-[250px] max-w-[300px] md:max-w-[500px]"
      style={{ ...(width ? { width } : {}) }}
    >
      {children}
      <div
        className="absolute top-0 right-0 h-full w-1 cursor-ew-resize hidden lg:block"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}
