'use client'

import React from 'react'
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'
import { useMobileSidebar } from '@/context/MobileSidebarContext'

export function MobileMenuButton() {
  const { isSidebarOpen, toggleSidebar } = useMobileSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      aria-label="Toggle sidebar"
    >
      {isSidebarOpen ? (
        <RiMenuFoldLine className="h-6 w-6" />
      ) : (
        <RiMenuUnfoldLine className="h-6 w-6 font-bold" />
      )}
    </button>
  )
}
