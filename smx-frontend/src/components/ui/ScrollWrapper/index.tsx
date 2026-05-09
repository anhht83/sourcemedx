import React, { useEffect } from 'react'
import { useScroll } from '@/hooks/useScroll'
import { ScrollButton } from '@/components/ui/ScrollButton'

interface IScrollWrapperProps {
  children: any
  triggerScrollToBottom?: any
}

export const ScrollWrapper = ({
  children,
  triggerScrollToBottom = false,
}: IScrollWrapperProps) => {
  const { scrollContainerRef, scrollEndRef, scrollToBottom, showScrollButton } =
    useScroll()

  useEffect(() => {
    if (!!triggerScrollToBottom) scrollToBottom()
  }, [triggerScrollToBottom])

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 h-full w-full grow overflow-auto"
    >
      {children}
      <div ref={scrollEndRef} />
      <ScrollButton
        showScrollButton={showScrollButton}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
