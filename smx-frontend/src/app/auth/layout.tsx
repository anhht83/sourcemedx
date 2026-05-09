import type { Metadata } from 'next'
import '@/app/globals.css'
import Image from 'next/image'
import mainBg from '@/assets/images/mainBg.svg'
import React from 'react'
import sourcemedx from '@/assets/images/sourcemedx.svg'

export const metadata: Metadata = {
  title: 'SourceMedX - Global B2B Medical Device Sourcing',
  description:
    'SourceMedX revolutionizes global medical device sourcing by empowering buyers to rapidly discover and select best-fit products. Sellers can expand reach and visibility—driving faster, smarter, and more profitable decisions for all stakeholders.',
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Image
        src={mainBg}
        alt="background"
        className="fixed inset-0 w-full h-full object-cover -z-0"
      />
      <div className="min-h-screen w-full h-full flex flex-col justify-center items-center p-6 sm:p-8 lg:p-[3.75rem] z-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl">
          <div className="w-full flex flex-col justify-center gap-3 lg:gap-4">
            <Image
              src={sourcemedx}
              alt="logo"
              className="lg:w-[260px] sm:w-[200px] w-[160px]"
            />
            <div className="xl:text-4xl sm:text-3xl text-2xl">
              Global B2B Medical Device Sourcing
            </div>
            <div className="font-light text-gray-500">
              Accessible . Simple . Transparent
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
