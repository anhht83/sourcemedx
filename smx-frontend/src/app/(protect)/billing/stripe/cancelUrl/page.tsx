'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { IoWarningOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

export default function StripeCancelPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <IoWarningOutline className="text-yellow-500" size={80} />
      <h1 className="text-3xl font-bold mt-6 mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8">
        Your payment was cancelled. You can try again or contact support if you
        need help.
      </p>
      <Button color="primary" onClick={() => router.push('/billing/buy')}>
        Try Again
      </Button>
    </div>
  )
}
