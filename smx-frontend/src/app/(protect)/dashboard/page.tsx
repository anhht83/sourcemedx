import React from 'react'
import { ChatForm } from '@/app/(protect)/components/ChatForm'

export const generateMetadata = () => ({
  title: 'SourceMedX - Dashboard',
})
export default async function DashboardPage() {
  return (
    <div className="flex flex-1 w-full h-full flex-col items-center justify-center px-4 md:px-5 lg:px-6 mx-auto md:max-w-3xl lg:max-w-4xl">
      <h1 className="text-2xl md:text-3xl mb-4 text-center">
        What can I find for you?
      </h1>
      <div className="w-full max-w-2xl">
        <ChatForm />
      </div>
    </div>
  )
}
