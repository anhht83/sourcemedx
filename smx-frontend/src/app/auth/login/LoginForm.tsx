'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { A } from '@/components/ui/A'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { ILoginRequest } from '@/types/user'
import { handleError } from '@/lib/AppError'
import { loginService } from '@/services/authService'
import { useRouter } from 'next/navigation'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('Password is required'),
})
export default function LoginForm() {
  const router = useRouter()
  const initialValues: ILoginRequest = { email: '', password: '' }

  const onSubmit = async (
    values: ILoginRequest,
    formikHelpers: FormikHelpers<ILoginRequest>,
  ) => {
    formikHelpers.setStatus('')
    try {
      await loginService(values)
      router.push(process.env.NEXT_PUBLIC_HOME_PATH!)
    } catch (error: any) {
      handleError(error, formikHelpers)
    }
    formikHelpers.setSubmitting(false)
  }

  return (
    <Formik<ILoginRequest>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ status, isSubmitting }) => (
        <Form className="flex flex-col items-center gap-4 lg:px-10">
          {status?.error && (
            <div
              className="text-sm text-red-600 text-center"
              dangerouslySetInnerHTML={{ __html: status.error }}
            >
              {/* {status.error} */}
            </div>
          )}
          <Input className="w-full" name="email" label="Email" />
          <Input
            className="w-full"
            name="password"
            type="password"
            label="Password"
          />
          <div className="w-full text-left pl-2">
            <A href="/auth/forgot-password">Forgot password</A>
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Login
          </Button>
          <div className="flex gap-2">
            <span>{`Don't have an account?`}</span>
            <A href="/auth/register">Sign Up</A>
          </div>
        </Form>
      )}
    </Formik>
  )
}
