import { FaSpinner } from 'react-icons/fa'
import classNames from 'classnames'

export type TLoadingSpinner = {
  size?: any
  className?: string
}

export const LoadingSpinner = ({ size, className = '' }: TLoadingSpinner) => {
  return (
    <FaSpinner className={classNames('animate-spin', className)} size={size} />
  )
}

export default LoadingSpinner
