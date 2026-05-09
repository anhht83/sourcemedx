'use client'

import React from 'react'
import { Messages } from '@/app/(protect)/dashboard/[threadId]/Messages'
import { ChatForm } from '@/app/(protect)/components/ChatForm'
import LoadingSpinner from '@/components/ui/Loading'
import { ESearchStatus } from '@/enums/chat.enum'
import { ScrollWrapper } from '@/components/ui/ScrollWrapper'
import { Report } from '@/app/(protect)/dashboard/[threadId]/Report'
import { IThread } from '@/types/chat'
import { useMessage } from '@/hooks/useMessage'

type TThreadDetailProps = {
  thread?: IThread
  isLoading: boolean
}

export function ThreadDetail({ isLoading, thread }: TThreadDetailProps) {
  const { messages, handleNewMessage } = useMessage({ thread })
  return (
    <>
      <div className="flex-1 h-full w-full grow overflow-hidden mx-auto md:max-w-3xl lg:max-w-4xl">
        {isLoading && (
          <div className="flex flex-1 h-full items-center justify-center">
            <LoadingSpinner className="text-4xl" />
          </div>
        )}
        {!isLoading && thread && messages?.length && (
          <ScrollWrapper triggerScrollToBottom={messages?.length}>
            <div className="px-4 relative md:px-5 lg:px-6 md:mx-12">
              <Messages messages={messages} />
              <Report thread={thread} />
            </div>
            <div className="md:h-20"></div>
          </ScrollWrapper>
        )}
      </div>
      {thread?.searchStatus !== ESearchStatus.searching &&
        thread?.searchStatus !== ESearchStatus.completed_search && (
          <div className="pb-6 bg-white sticky w-full bottom-0 mx-auto md:max-w-3xl lg:max-w-4xl">
            <div className="px-4 md:px-5 lg:px-6 md:mx-12">
              <ChatForm
                threadId={thread?.id}
                storeMessageOnLocal={handleNewMessage}
              />
            </div>
          </div>
        )}
    </>
  )
}
