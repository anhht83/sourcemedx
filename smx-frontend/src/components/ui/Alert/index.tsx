import { motion, AnimatePresence } from 'framer-motion'
import { useState, ReactNode } from 'react'
import classnames from 'classnames'

type TAlertType = 'error' | 'warning' | 'success' | 'info'
type TAlertVariant = 'text' | 'normal'

interface IAlertProps {
  type?: TAlertType
  variant?: TAlertVariant
  title?: string
  message?: string
  children?: ReactNode
  onClose?: () => void
  show?: boolean
  dismissible?: boolean
  className?: string
}

const alertStyles = {
  text: {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-600',
    info: 'text-blue-500',
  },
  normal: {
    error: 'bg-red-100 text-red-800 border-red-800',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-800',
    success: 'bg-green-100 text-green-800 border-green-800',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  },
}

const alertVariants = {
  text: 'p-0',
  normal: 'p-4 border shadow-md',
}

/**
 * 🎨 Reusable Alert component with support for error, warning, success, and info.
 * Supports custom children for flexible content.
 */
export const Alert: React.FC<IAlertProps> = ({
  type = 'info',
  variant = 'normal',
  title,
  message,
  children,
  onClose,
  show = true,
  dismissible = true,
  className = '',
}) => {
  const [visible, setVisible] = useState(show)

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          role="alert"
          className={classnames(
            className,
            'rounded-xl flex items-start gap-3',
            alertStyles[variant][type],
            alertVariants[variant],
          )}
        >
          <div className="flex-1">
            {title && <h4 className="text-lg font-semibold mb-2">{title}</h4>}
            {message}
            {children}
          </div>
          {dismissible && (
            <button
              onClick={handleClose}
              aria-label="Close alert"
              className="text-gray-500 hover:text-gray-800"
            >
              ✖️
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
