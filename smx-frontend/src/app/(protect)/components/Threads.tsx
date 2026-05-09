'use client'

import { Thread } from '@/app/(protect)/components/Thread'
import { useFetchThreadsService } from '@/services/chatService'
import LoadingSpinner from '@/components/ui/Loading'
import { useParams } from 'next/navigation'
import { useMobileSidebar } from '@/context/MobileSidebarContext'

export function Threads() {
  const { threadId } = useParams()
  const { isLoading, data: threads } = useFetchThreadsService()
  const { closeSidebar } = useMobileSidebar()

  const handleThreadClick = () => {
    // Close sidebar on mobile when a thread is clicked
    closeSidebar()
  }

  return (
    <>
      <div className="p-3 text-xl md:text-2xl font-bold text-center">
        Reports
      </div>
      <div className="p-1 lg:p-3 flex flex-col overflow-auto gap-1.5">
        {isLoading && <LoadingSpinner />}
        {!isLoading &&
          threads &&
          threads.map((thread) => (
            <div key={thread.id} onClick={handleThreadClick}>
              <Thread thread={thread} isActive={threadId === thread.id} />
            </div>
          ))}
      </div>
    </>
  )
}
