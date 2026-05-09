import Link from 'next/link'
import classNames from 'classnames'
import React from 'react'

interface IAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  color?: 'primary' | 'secondary'
  underline?: boolean
  children: React.ReactNode
}

export function A({
  href,
  color = 'primary',
  underline = false,
  className,
  children,
  ...props
}: IAProps) {
  const baseStyles = 'hover:underline transition'

  const colorStyles = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
  }

  return (
    <Link
      href={href}
      className={classNames(
        baseStyles,
        colorStyles[color],
        underline && 'underline',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
