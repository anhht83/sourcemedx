'use client'

import classNames from 'classnames'
import itemIcon from '@/assets/images/itemIcon.svg'
import circleArrow from '@/assets/images/circleArrow.svg'
import Image from 'next/image'
import { IThread } from '@/types/chat'
import { defaultFormattedDate } from '@/lib/dateFormat'
import { useRouter } from 'next/navigation'
import { ESearchStatus } from '@/enums/chat.enum'
import { BiCheck, BiSearch } from 'react-icons/bi'
import { MdCancel } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'

export interface IThreadProps {
  thread: IThread
  className?: string
  isActive?: boolean
}

const SearchStatusIcon = ({ status }: { status: ESearchStatus }) => {
  if (status === ESearchStatus.searching) {
    return (
      <div className="h-8 w-8 min-w-8 relative text-xl border border-blue-700 text-blue-700 rounded-full flex justify-center items-center  ">
        <BiSearch className="group-hover:scale-110 duration-300 transform transition-transform " />
      </div>
    )
  }
  if (status === ESearchStatus.completed_search) {
    return (
      <div className="h-8 w-8 min-w-8 relative text-xl border border-green-700 text-green-700 rounded-full flex justify-center items-center  ">
        <BiCheck className="group-hover:scale-125 duration-300 transform transition-transform " />
      </div>
    )
  }

  if (status === ESearchStatus.failed_search) {
    return (
      <div className="h-8 w-8 min-w-8 relative text-xl border border-red-700 text-red-700 rounded-full flex justify-center items-center  ">
        <MdCancel className="group-hover:scale-125 duration-300 transform transition-transform " />
      </div>
    )
  }

  if (status === ESearchStatus.cancelled) {
    return (
      <div className="h-8 w-8 min-w-8 relative text-xl border border-red-700 text-red-700 rounded-full flex justify-center items-center  ">
        <TiTimes className="group-hover:scale-125 duration-300 transform transition-transform " />
      </div>
    )
  }

  return (
    <Image
      width={32}
      height={32}
      src={circleArrow}
      alt="to chat"
      className="transition-transform duration-300 transform group-hover:rotate-45"
    />
  )
}

export function Thread({
  thread,
  className = '',
  isActive = false,
}: IThreadProps) {
  const router = useRouter()

  return (
    <div
      className={classNames(
        ' w-full flex justify-between items-center cursor-pointer group rounded-xl py-1 px-3',
        className,
        isActive ? ' bg-gray-300' : '',
      )}
      onClick={() => router.push(`/dashboard/${thread.id}`)}
    >
      <div className="flex gap-2 items-center w-full">
        <Image width={32} height={32} src={itemIcon} alt="item" />
        <div className="flex flex-col items-start">
          <div className="text-textPrimary">{thread.title}</div>
          <span className="text-xs text-textSecondary">
            {defaultFormattedDate(thread.updatedAt)}
          </span>
        </div>
      </div>
      <SearchStatusIcon status={thread.searchStatus} />
    </div>
  )
}
