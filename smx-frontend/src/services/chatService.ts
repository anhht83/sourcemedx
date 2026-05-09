'use client'

import { apiFetch } from '@/lib/fetch'
import { IMessage, IMessageRequest, IThread } from '@/types/chat'
import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query'
import { IReportProcess } from '@/types/report'

export const threadsKey = ['threads']
export const threadKey = (threadId?: string) => ['thread', threadId]
export const threadGenerateReportKe = (threadId?: string) => [
  'thread',
  threadId,
  'generate_report',
]

// query to fetch threads
export function useFetchThreadsService(
  options?: any,
): UseQueryResult<IThread[], DefaultError> {
  return useQuery({
    queryKey: threadsKey,
    queryFn: async () => {
      try {
        return await apiFetch<IThread[]>('/threads')
      } catch (error) {
        throw error
      }
    },
    staleTime: 5000,
    ...options,
  })
}

// query to fetch messages
export function useGetThreadService(
  threadId?: string,
  options?: any,
): UseQueryResult<IThread, DefaultError> {
  return useQuery({
    queryKey: threadKey(threadId),
    queryFn: async () => {
      try {
        return await apiFetch<IThread>(`/threads/${threadId}`)
      } catch (error) {
        throw error
      }
    },
    staleTime: 5000,
    ...options,
  })
}

// query to send message
export function useSubmitChatService(options?: any) {
  const queryClient = useQueryClient()

  return useMutation<IMessage, Error, IMessageRequest>({
    mutationFn: async ({ threadId, message }: IMessageRequest) => {
      try {
        return await apiFetch<IMessage>('/chat', {
          method: 'POST',
          body: {
            threadId,
            message,
          },
        })
      } catch (error) {
        throw error
      }
    },
    ...(options || {}),
    onSuccess: (newMessages, variables) => {
      // reload threads/messages after sending message
      if (!variables.threadId) {
        queryClient.invalidateQueries({ queryKey: threadsKey })
      } else {
        queryClient.invalidateQueries({
          queryKey: threadKey(variables.threadId),
        })
      }
      if (options?.onSuccess) options.onSuccess(newMessages, variables)
    },
  })
}

// query to fetch messages
export function useGenerateReportService(
  threadId?: string,
  options?: any,
): UseQueryResult<IReportProcess, DefaultError> {
  return useQuery({
    queryKey: threadGenerateReportKe(threadId),
    queryFn: async () => {
      try {
        return await apiFetch<IThread>(`/threads/${threadId}/generate-report`)
      } catch (error) {
        throw error
      }
    },
    enabled: false,
    ...options,
  })
}
