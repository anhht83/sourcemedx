'use client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { A } from '@/components/ui/A'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { handleError } from '@/lib/AppError'
import { resetPasswordService } from '@/services/authService'
import { Alert } from '@/components/ui/Alert'
import { useSearchParams } from 'next/navigation'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('This field is required'),
  confirmPassword: Yup.string()
    .required('This field is required')
    .oneOf([Yup.ref('password')], "Confirm password doesn't match"),
})

interface IResetPasswordFormProps {
  password: string
  confirmPassword: string
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const initialValues: IResetPasswordFormProps = {
    password: '',
    confirmPassword: '',
  }

  const onSubmit = async (
    values: IResetPasswordFormProps,
    formikHelpers: FormikHelpers<IResetPasswordFormProps>,
  ) => {
    formikHelpers.setStatus('')
    try {
      await resetPasswordService({
        token,
        newPassword: values.password,
      })
      formikHelpers.setStatus({ success: true })
    } catch (error) {
      handleError(error, formikHelpers)
    }
    formikHelpers.setSubmitting(false)
  }

  return (
    <Formik<IResetPasswordFormProps>
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
            <Alert variant="text" type="success" dismissible={false}>
              Password reset successfully
            </Alert>
          )}
          <Input
            className="w-full"
            name="password"
            type="password"
            label="New Passaword"
          />
          <Input
            className="w-full"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
          />
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
