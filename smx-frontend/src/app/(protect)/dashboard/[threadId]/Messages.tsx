'use client'

import { ESender } from '@/enums/chat.enum'
import classNames from 'classnames'
import { Logo } from '@/components/ui/Logo'
import { useSocket } from '@/context/SocketContext'
import TypingIndicator from '@/components/ui/TypingIndicator'
import { IMessage } from '@/types/chat'
import ReactMarkdown from 'react-markdown'

const messageBgStyle = {
  [ESender.USER]: 'bg-gray-200 rounded-tr-none',
  [ESender.AI]: 'text-white bg-gradient-to-r from-[#478ECC] to-[#005C98]',
}
const messagePositionStyle = {
  [ESender.USER]: 'flex-col items-end ',
  [ESender.AI]: 'flex-row items-start my-auto mx-auto py-5',
}

type TMessagesProps = {
  messages: IMessage[]
}

export function Messages({ messages }: TMessagesProps) {
  const { loadingAIResponse } = useSocket()

  return (
    <>
      {!messages?.length && (
        <div className="p-3 text-xl md:text-2xl font-bold text-center">
          Reports
        </div>
      )}
      <div className="pt-12">
        {messages.map((message, index) => (
          <div
            key={`${message.id}_${index}`}
            className={classNames(
              `flex w-full empty:hidden`,
              messagePositionStyle[message.sender],
            )}
          >
            {message.sender === ESender.AI && (
              <Logo className="border mr-2 md:-ml-12 lg:-ml-16"></Logo>
            )}
            <div
              className={classNames(
                'rounded-2xl p-3 md:p-4 max-w-[85%] md:max-w-[75%] lg:max-w-[70%] prose prose-sm md:prose-base max-w-none',
                messageBgStyle[message.sender],
              )}
            >
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loadingAIResponse && (
          <div
            key="ai_responding"
            className={classNames(
              `flex w-full gap-1 empty:hidden`,
              messagePositionStyle[ESender.AI],
            )}
          >
            <Logo className="border mr-2 md:-ml-12 lg:-ml-16"></Logo>
            <div
              className={classNames(
                'rounded-2xl p-3 md:p-4 max-w-[85%] md:max-w-[75%] lg:max-w-[70%]',
                messageBgStyle[ESender.AI],
              )}
            >
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
