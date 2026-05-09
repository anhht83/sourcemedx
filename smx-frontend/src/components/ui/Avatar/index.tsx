import classNames from 'classnames'
import React from 'react'
import Image from 'next/image'

interface IAvatarProps {
  width?: number
  height?: number
  name?: string
  avatarUrl?: string
  border?: boolean
  className?: string
}

export function Avatar({
  width = 44,
  height = 44,
  name,
  avatarUrl,
  border = false,
  className = '',
}: IAvatarProps) {
  return (
    <div
      className={classNames(
        'relative rounded-full bg-white',
        border ? 'border border-gray-300' : '',
        className,
      )}
      style={{ height, width }}
    >
      {avatarUrl && (
        <Image
          alt="Logo"
          loading="lazy"
          decoding="async"
          data-nimg="fill"
          className="object-cover rounded-full h-full w-full inset-0"
          src={avatarUrl}
        />
      )}
      {!avatarUrl && name && (
        <div className="h-full w-full flex items-center justify-center rounded-full bg-[#FFFB93] text-[#B6AF00] text-2xl leading-4  font-bold">
          {name.charAt(0)?.toUpperCase()}
        </div>
      )}
    </div>
  )
}
