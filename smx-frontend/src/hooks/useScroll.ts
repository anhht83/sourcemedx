'use client'

import { useEffect, useRef, useState } from 'react'

export const useScroll = () => {
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = (behavior?: ScrollBehavior) => {
    if (behavior && behavior !== 'smooth') {
      setTimeout(() => {
        scrollEndRef.current?.scrollIntoView({ behavior })
      }, 500)
    } else {
      scrollEndRef.current?.scrollIntoView({ behavior: behavior ?? 'smooth' })
    }
  }

  useEffect(() => {
    if (!scrollContainerRef?.current) return
    const scrollContainer = scrollContainerRef.current
    const handleScroll = () => {
      if (!scrollContainer) return // Ensures chatContainer is always defined
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50)
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [scrollContainerRef.current])

  return {
    scrollEndRef,
    scrollContainerRef,
    scrollToBottom,
    showScrollButton, // Return state to be used in the button
  }
}
