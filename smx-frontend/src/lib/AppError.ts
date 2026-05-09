import { FormikHelpers } from 'formik'

export interface IAppErrorResponse {
  statusCode?: number
  message?: string
  errors?: {
    invalidFields?: { [key: string]: any }
    [key: string]: any
  }
}

export class AppError extends Error {
  statusCode: number
  response: IAppErrorResponse // Extra error details
  constructor(response: IAppErrorResponse | string, statusCode: number = 500) {
    super(
      (typeof response === 'string' ? response : response.message) ||
        'Internal Server Error',
    )

    this.name = 'AppError'
    this.statusCode = statusCode
    this.response =
      typeof response === 'string' ? { message: response } : response

    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (
  error: any,
  { setStatus, setErrors }: FormikHelpers<any>,
) => {
  if (error instanceof AppError) {
    if (error.response.errors?.invalidFields)
      setErrors(error.response.errors?.invalidFields)
    setStatus({ error: error.message })
  }
  setStatus({
    error: error.message || 'Network error. Please try again later.',
  })
}
