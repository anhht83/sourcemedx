'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

export default function StripeSuccessPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <IoCheckmarkCircleOutline className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold mt-6 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your SearchKeys will be available soon.
      </p>
      <Button color="primary" onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  )
}
