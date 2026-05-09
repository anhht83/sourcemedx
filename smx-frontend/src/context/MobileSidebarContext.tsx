'use client'

import React, { createContext, useContext, useState } from 'react'

interface MobileSidebarContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

const MobileSidebarContext = createContext<
  MobileSidebarContextType | undefined
>(undefined)

export function MobileSidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <MobileSidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, closeSidebar }}
    >
      {children}
    </MobileSidebarContext.Provider>
  )
}

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext)
  if (context === undefined) {
    throw new Error(
      'useMobileSidebar must be used within a MobileSidebarProvider',
    )
  }
  return context
}
