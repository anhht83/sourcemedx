'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import { ESocketEvent } from '@/enums/socket.enum'
import { IThread } from '@/types/chat'
import { ESearchStatus } from '@/enums/chat.enum'
import { useGenerateReportService } from '@/services/chatService'
import { IReportProcess } from '@/types/report'

type TUseReportProps = {
  thread?: IThread
}
/*
 * Hook to load report
 */
export const useReport = ({ thread }: TUseReportProps) => {
  const { socket } = useSocket()
  const [reportProcess, setReportProcess] = useState<
    IReportProcess | undefined
  >()
  const { refetch } = useGenerateReportService(thread?.id)
  const onReGenerateReport = () => {
    refetch()
  }

  useEffect(() => {
    if (!socket || !thread) return
    // skip if thread is not searching
    if (thread?.searchStatus !== ESearchStatus.searching) return
    setReportProcess({
      progress: 0,
      message: 'Searching data ...',
    })
    socket.on(ESocketEvent.reportProgress, (message: IReportProcess) => {
      setReportProcess(message)
      if (message?.isCompleted) {
        socket.off(ESocketEvent.reportProgress)
      }
    })

    // Cleanup function to remove listener when component unmounts
    return () => {
      socket.off(ESocketEvent.reportProgress)
    }
  }, [socket, thread]) // Re-run only when `socket` or `threadId` changes

  return { reportProcess, onReGenerateReport }
}
