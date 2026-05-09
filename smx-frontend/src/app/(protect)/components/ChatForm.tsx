'use client'

import classNames from 'classnames'
import React from 'react'
import arrowIcon from '@/assets/images/arrow-up-blue.svg'
import Image from 'next/image'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { IMessage, IMessageRequest } from '@/types/chat'
import { useSubmitChatService } from '@/services/chatService'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/Loading'
import { useSocket } from '@/context/SocketContext'
import { BiPause } from 'react-icons/bi'
import { ESender } from '@/enums/chat.enum'

type TChatFormProps = {
  threadId?: string
  className?: string
  placeholder?: string
  storeMessageOnLocal?: (message: IMessage) => void
}

export const ChatForm = ({
  threadId,
  className,
  placeholder,
  storeMessageOnLocal,
}: TChatFormProps) => {
  const { loadingAIResponse, setLoadingAIResponse } = useSocket()

  const router = useRouter()

  const { isPending, mutate } = useSubmitChatService()

  const onSubmit = async (values: IMessageRequest, formikHelpers: any) => {
    formikHelpers.setFieldValue('message', '')
    // optimize: store message on local
    if (threadId) {
      storeMessageOnLocal?.({
        id: Date.now().toString(), // temporary message id
        message: values.message,
        sender: ESender.USER,
        threadId,
      })
      setLoadingAIResponse(true)
    }
    // send message
    mutate(
      {
        message: values.message,
        threadId,
      },
      {
        onSuccess: (data) => {
          // direct to thread page if this is the first message
          if (!threadId) {
            router.replace(
              `${process.env.NEXT_PUBLIC_HOME_PATH!}/${data.threadId}`,
            )
          }
        },
        onError: (error) => {
          alert(error.message)
        },
      },
    )
  }

  return (
    <div
      className={classNames(
        'w-full relative border border-gray-300 rounded-full shadow-md hover:border-gray-400 transition-colors duration-200',
        className,
      )}
    >
      <Formik<IMessageRequest>
        initialValues={{ message: '' }}
        validationSchema={Yup.object({
          message: Yup.string().required('Message is required').trim(),
        })}
        onSubmit={onSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="relative">
            <Field
              autoFocus={true}
              name="message"
              autoComplete="off"
              placeholder={placeholder || 'Type your message...'}
              className="w-full rounded-full h-12 md:h-14 pl-4 pr-14 focus:outline-none focus:border-transparent text-sm md:text-base"
            />

            <button
              disabled={isPending || loadingAIResponse || !isValid || !dirty}
              type="submit"
              className={classNames(
                'absolute right-0 top-0 h-12 w-12 md:h-14 md:w-14 flex items-center justify-center transition-opacity duration-200',
                (!isValid || !dirty) && 'opacity-50 cursor-not-allowed',
              )}
              title={
                isPending
                  ? 'Sending...'
                  : loadingAIResponse
                    ? 'Processing...'
                    : 'Send message'
              }
            >
              {isPending ? (
                <LoadingSpinner className="h-8 w-8 md:h-10 md:w-10" />
              ) : loadingAIResponse ? (
                <BiPause className="h-10 w-10 md:h-12 md:w-12 p-2 rounded-full bg-gray-200" />
              ) : (
                <Image
                  src={arrowIcon}
                  alt="Send message"
                  className="h-10 w-10 md:h-12 md:w-12 hover:scale-105 transition-transform duration-200"
                />
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
