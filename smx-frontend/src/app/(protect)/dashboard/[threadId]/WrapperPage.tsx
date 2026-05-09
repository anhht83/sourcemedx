'use client'

import React from 'react'
import { useThread } from '@/hooks/useThread'
import { ThreadDetail } from '@/app/(protect)/dashboard/[threadId]/ThreadDetail'

export function WrapperPage({ threadId }: { threadId: string }) {
  const { isLoading, thread } = useThread({ threadId })
  return <ThreadDetail isLoading={isLoading} thread={thread} />
}
