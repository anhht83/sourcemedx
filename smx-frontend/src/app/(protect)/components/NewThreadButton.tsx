'use client'

import { Button } from '@/components/ui/Button'
import { FiEdit } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export const NewThreadButton = () => {
  const router = useRouter()
  return (
    <Button
      color="default"
      icon={<FiEdit />}
      rounded="rounded-full"
      size="xs"
      onClick={() =>
        router.push(process.env.NEXT_PUBLIC_HOME_PATH || '/dashboard')
      }
      className="hover:bg-gray-100 transition-colors duration-200"
      title="Start a new report"
    >
      New Report
    </Button>
  )
}
