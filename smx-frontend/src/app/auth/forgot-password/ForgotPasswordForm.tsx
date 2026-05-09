'use client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { A } from '@/components/ui/A'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { IForgotPasswordRequest } from '@/types/user'
import { handleError } from '@/lib/AppError'
import { forgotPasswordService } from '@/services/authService'
import { Alert } from '@/components/ui/Alert'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
})
export default function ForgotPasswordForm() {
  const initialValues: IForgotPasswordRequest = { email: '' }

  const onSubmit = async (
    values: IForgotPasswordRequest,
    formikHelpers: FormikHelpers<IForgotPasswordRequest>,
  ) => {
    formikHelpers.setStatus('')
    try {
      await forgotPasswordService(values.email)
      formikHelpers.setStatus({ success: true })
    } catch (error) {
      handleError(error, formikHelpers)
    }
    formikHelpers.setSubmitting(false)
  }

  return (
    <Formik<IForgotPasswordRequest>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ status, isSubmitting, handleSubmit }) => (
        <Form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col items-center gap-4"
        >
          {status?.error && (
            <Alert variant="text" type="error" dismissible={false}>
              {status.error}
            </Alert>
          )}
          {status?.success && (
            <Alert type="success" title={'Check Your Email'}>
              <p className="text-gray-700">
                If the email provided is associated with an account, a password
                reset link has been sent. Please check your inbox and spam
                folder. The link is valid for 24 hours.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Didn’t receive the email?{' '}
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleSubmit()}
                >
                  Resend
                </button>
              </p>
            </Alert>
          )}
          <Input className="w-full" name="email" label="Email" />
          <Button
            onClick={() => handleSubmit()}
            isLoading={isSubmitting}
            className="w-full"
          >
            Continue
          </Button>
          <div className="flex gap-2">
            <span>{`Back to`}</span>
            <A href="/auth/login">Login</A>
          </div>
        </Form>
      )}
    </Formik>
  )
}
