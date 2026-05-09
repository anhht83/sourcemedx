import type { Metadata } from 'next'
import '@/app/globals.css'
import { Sidebar } from '@/app/(protect)/components/Sidebar'
import { HeaderWrapper } from '@/components/ui/HeaderWrapper'
import { UserNavigator } from '@/app/(protect)/components/UserNavigator'
import { MobileMenuButton } from '@/components/ui/MobileMenuButton'
import React from 'react'
import { SocketProvider } from '@/context/SocketContext'
import { MobileSidebarProvider } from '@/context/MobileSidebarContext'
import { getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'SourceMedX - Global B2B Medical Device Sourcing',
  description:
    'SourceMedX revolutionizes global medical device sourcing by empowering buyers to rapidly discover and select best-fit products. Sellers can expand reach and visibility—driving faster, smarter, and more profitable decisions for all stakeholders.',
  icons: [
    {
      url: '/favicon.png',
      type: 'image/png',
      sizes: '32x32',
    },
  ],
}

export default async function ProtectedLayout({ children }: any) {
  const currentUser = await getCurrentUser()
  return (
    <SocketProvider>
      <MobileSidebarProvider>
        <Sidebar />
        <div className="relative flex-1 flex flex-col h-screen">
          <HeaderWrapper className="justify-between">
            <div className="mobile-menu-button">
              <MobileMenuButton />
            </div>
            <UserNavigator user={currentUser} />
          </HeaderWrapper>
          {children}
        </div>
      </MobileSidebarProvider>
    </SocketProvider>
  )
}
