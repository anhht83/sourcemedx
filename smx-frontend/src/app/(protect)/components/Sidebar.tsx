'use client'

import { Logo } from '@/components/ui/Logo'
import { HeaderWrapper } from '@/components/ui/HeaderWrapper'
import { ResizablePanel } from '@/components/ui/ResizablePanel'
import { Threads } from '@/app/(protect)/components/Threads'
import { NewThreadButton } from '@/app/(protect)/components/NewThreadButton'
import { useMobileSidebar } from '@/context/MobileSidebarContext'
import { useEffect } from 'react'
import { RiMenuFoldLine } from 'react-icons/ri'

export const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useMobileSidebar()

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (
        isSidebarOpen &&
        !target.closest('.sidebar') &&
        !target.closest('.mobile-menu-button')
      ) {
        closeSidebar()
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen, closeSidebar])

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <ResizablePanel>
          <div className="h-full bg-gray-200 border-r border-gray-300 flex flex-col">
            <HeaderWrapper>
              <div className="flex items-center justify-between w-full">
                <Logo />
                <div className="flex items-center gap-2">
                  <NewThreadButton />
                  <button
                    onClick={closeSidebar}
                    className="lg:hidden p-1 rounded-md text-gray-600"
                    aria-label="Close sidebar"
                  >
                    <RiMenuFoldLine className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </HeaderWrapper>
            <Threads />
          </div>
        </ResizablePanel>
      </div>
    </>
  )
}
