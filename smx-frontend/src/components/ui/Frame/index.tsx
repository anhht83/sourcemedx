import classNames from 'classnames'
import React from 'react'

export type TFrameProps = {
  classname?: string
  title?: string
  description?: any
  children?: React.ReactNode
}

export const Frame = ({
  classname = '',
  title,
  description,
  children,
}: TFrameProps) => {
  return (
    <div
      className={classNames(
        'w-full flex flex-col justify-center bg-[#F5F2EE40] rounded-2xl border border-[#F5F2EE]',
        'py-8 md:py-12 px-6',
        classname,
      )}
    >
      {title && (
        <div
          className={`xl:text-4xl text-3xl font-medium text-center ${description ? 'mb-2' : 'mb-6'}`}
        >
          {title}
        </div>
      )}
      {description && (
        <p className="text-p text-gray-600 text-center mb-6 px-2">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
