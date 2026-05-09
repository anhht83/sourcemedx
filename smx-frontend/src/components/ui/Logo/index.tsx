import React from 'react'
import logo from '@/assets/images/logo.svg'
import Image from 'next/image'
import classNames from 'classnames'

interface ILogoProps {
  variant?: 'light' | 'dark' | 'blue'
  rounded?: 'rounded-full' | 'rounded-lg' | 'rounded-md'
  width?: number
  height?: number
  className?: string
}

export function Logo({
  variant = 'light',
  rounded = 'rounded-full',
  width = 44,
  height = 44,
  className = '',
}: ILogoProps) {
  const bgColor = {
    light: 'bg-white',
    dark: 'bg-[#231F20]',
    blue: 'bg-[#005C98]',
  }
  return (
    <div
      className={classNames(
        'relative flex-shrink-0 min-w-[44px]',
        rounded,
        bgColor[variant],
        className,
      )}
      style={{ height, width }}
    >
      <Image
        src={logo}
        alt="Logo"
        fill
        className={classNames('object-cover', rounded)}
      />
    </div>
  )
}
