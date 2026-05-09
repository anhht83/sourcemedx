import React from 'react'
import classNames from 'classnames'

interface IHeaderWrapperProps {
  children?: React.ReactNode
  className?: string
}

export function HeaderWrapper({
  className = '',
  children,
}: IHeaderWrapperProps) {
  return (
    <div className="p-2 px-4 lg:px-6 lg:py-4 sticky top-0 z-30">
      <div
        className={classNames(
          'h-[44px] w-full flex flex-row justify-between items-center',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
