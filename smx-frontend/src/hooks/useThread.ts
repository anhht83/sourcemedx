'use client'

import { useEffect } from 'react'
import { useGetThreadService } from '@/services/chatService'
import { redirect } from 'next/navigation'

type TUseThreadProps = {
  threadId: string
}
/*
 * Hook to load messages of a thread, also handle new messages from AI / USER
 */
export const useThread = ({ threadId }: TUseThreadProps) => {
  const {
    isLoading,
    isFetched,
    data: thread,
  } = useGetThreadService(threadId, {
    enabled: !!threadId,
  })

  useEffect(() => {
    if (isFetched && !thread) {
      redirect(`/dashboard`)
    }
  }, [isFetched, thread])

  return {
    isLoading,
    thread,
  }
}
