'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { calculatePrice } from '@/lib/helper'
import { checkout } from '@/services/purchaseService'

export default function BuyRerports() {
  const [count, setCount] = useState(1)
  const [agreed, setAgreed] = useState(false)

  const { subtotal, discount, total, discountPercentage } =
    calculatePrice(count)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    await checkout(count)
  }

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="max-w-2xl mx-auto p-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Buy Reports</h2>
          <p className="text-gray-500 mb-6">
            You currently have access to 5 out of 100 available reports.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Add number of reports
            </label>
            <input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount ( {discountPercentage * 100}% )</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleCheckout}>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            <span className="text-xs text-gray-600">
              You’ll be charged the total amount above. By proceeding, you agree
              to our{' '}
              <a
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=3e0e1d6f-82e4-44fd-bad2-6f9189d5622c"
                target="_blank"
                className="underline"
              >
                Terms of Use
              </a>{' '}
              and{' '}
              <a
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=af1b9e23-cf78-4f59-9132-4ae96b545b4c"
                target="_blank"
                className="underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          </div>
          <Button
            type="submit"
            color="primary"
            className="w-full mt-4"
            disabled={!agreed}
          >
            Buy
          </Button>
          <div className="text-xs text-gray-400 text-center mt-2">
            Powered by <span className="font-semibold">Stripe</span>
          </div>
        </form>
      </div>
    </div>
  )
}
