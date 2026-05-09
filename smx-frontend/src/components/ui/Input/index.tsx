import { useField } from 'formik'
import classNames from 'classnames'
import { useState } from 'react'
import { PiEye, PiEyeSlash } from 'react-icons/pi'

export interface IInputProps {
  label?: string
  name: string
  type?: string
  className?: string
  asterisk?: boolean
}

export function Input({
  label,
  name,
  type = 'text',
  className = '',
  asterisk = false,
}: IInputProps) {
  const [showPassword, setShowPassword] = useState(false) // ✅ Toggle state

  const [field, meta] = useField(name)
  const hasError = meta.error !== undefined

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  return (
    <div className={className}>
      <div className="relative">
        <input
          {...field}
          id={name}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder=" "
          className={classNames(
            'px-4 pt-4',
            'h-11 lg:h-12 leading-[2.75rem] lg:leading-[3rem]',
            'text-base',
            'bg-bgInput border box-border border-borderInput placeholder-textSecondary text-black-500 w-full',
            'focus:ring-primary-500 focus:border-primary-500',
            'rounded-xl',
            'peer transition-all',
            meta.touched && hasError ? 'border-red-600' : '',
          )}
        />
        <label
          htmlFor={name}
          className={classNames(
            'absolute text-gray-400 duration-300 transform',
            '-translate-y-1/2 top-1/2 left-4 origin-[0]',
            'peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2',
            'peer-focus:scale-75 peer-focus:top-0 peer-focus:translate-y-0.5 peer-focus:text-primary-500',
            'peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:translate-y-0.5',
          )}
        >
          {`${label} ${asterisk ? '*' : ''}`}
        </label>
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1} // ✅ Prevents form submission on Enter
          >
            {showPassword ? (
              <PiEyeSlash className="w-5 h-5" />
            ) : (
              <PiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {meta.touched && meta.error && (
        <p className="text-xs leading-tight text-red-600 mt-1 px-2">
          {meta.error}
        </p>
      )}
    </div>
  )
}
