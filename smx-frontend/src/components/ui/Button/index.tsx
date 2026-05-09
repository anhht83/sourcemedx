import classNames from 'classnames'
import React from 'react'
import LoadingSpinner from '@/components/ui/Loading'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'default'
  variant?: 'solid' | 'outline'
  isLoading?: boolean
  rounded?: string
  children?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: any
}

export const Button = ({
  color = 'primary',
  variant = 'solid',
  isLoading = false,
  children,
  className = '',
  rounded = 'rounded-xl',
  icon,
  size = 'md',
  disabled,
  ...props
}: IButtonProps) => {
  const colorStyles = {
    solid: {
      default: 'border border-black-500 text-black-500',
      primary: 'bg-primary-500 text-accent font-medium',
      secondary: 'bg-black-500',
    },
    outline: {
      default: 'border border-black-500 text-black-500',
      primary: 'border border-primary-500 text-primary-500',
      secondary:
        'border border-primary-500 text-primary-500 hover:bg-primary-400',
    },
  }

  const sizeStyles = {
    xs: 'text-[14px] h-8 lg:h-9',
    sm: 'text-[16px] h-9 lg:h-10',
    md: 'text-[18px] h-11 lg:h-12',
    lg: 'text-[20px] h-12 lg:h-13',
  }

  return (
    <button
      {...props}
      className={classNames(
        'px-4',
        '!leading-4',
        'gap-2',
        'font-medium font-apercu',
        'flex flex-row justify-center items-center cursor-pointer hover:scale-105 transition-transform',
        rounded,
        sizeStyles[size],
        colorStyles[variant][color],
        disabled && 'opacity-50 cursor-not-allowed hover:bg-opacity-50',
        className,
      )}
      disabled={disabled || isLoading}
    >
      {icon}
      {children}
      {isLoading && <LoadingSpinner />}
    </button>
  )
}
