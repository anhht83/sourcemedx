'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { A } from '@/components/ui/A'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { IRegisterRequest } from '@/types/user'
import { handleError } from '@/lib/AppError'
import { registerService } from '@/services/authService'
import { useRouter } from 'next/navigation'

const validationSchema = Yup.object({
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  company: Yup.string().required('This field is required'),
  email: Yup.string().email('Invalid email').required('This field is required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('This field is required'),
  confirmPassword: Yup.string()
    .required('This field is required')
    .oneOf([Yup.ref('password')], "Confirm password doesn't match"),
})
export default function RegisterForm() {
  const router = useRouter()

  const initialValues: IRegisterRequest = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
  }

  const onSubmit = async (
    values: IRegisterRequest,
    formikHelpers: FormikHelpers<IRegisterRequest>,
  ) => {
    formikHelpers.setStatus('')
    try {
      await registerService(values)
      router.push(process.env.NEXT_PUBLIC_LOGIN_PATH!)
    } catch (error) {
      handleError(error, formikHelpers)
    }
    formikHelpers.setSubmitting(false)
  }

  return (
    <Formik<IRegisterRequest>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ status, isSubmitting }) => (
        <Form className="flex flex-col items-center gap-4 lg:px-8">
          {status?.error && (
            <div className="text-sm text-red-600 text-center">
              {status.error}
            </div>
          )}
          <div className="w-full grid grid-cols-2 gap-4">
            <Input
              className="w-full"
              name="firstName"
              label="First Name"
              asterisk
            />
            <Input
              className="w-full"
              name="lastName"
              label="Last Name"
              asterisk
            />
          </div>
          <Input
            className="w-full"
            name="company"
            label="Company / Organization"
            asterisk
          />
          <Input
            className="w-full"
            type="email"
            name="email"
            label="Email"
            asterisk
          />
          <Input
            className="w-full"
            name="password"
            type="password"
            label="Password"
            asterisk
          />
          <Input
            className="w-full"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            asterisk
          />
          <p className="w-full text-center">
            By submitting this form, you are agreeing to our{' '}
            <A
              href="https://app.termly.io/policy-viewer/policy.html?policyUUID=3e0e1d6f-82e4-44fd-bad2-6f9189d5622c"
              target="_blank"
              underline
              color="secondary"
            >
              Privacy Policy
            </A>{' '}
            and{' '}
            <A
              href="https://app.termly.io/policy-viewer/policy.html?policyUUID=af1b9e23-cf78-4f59-9132-4ae96b545b4c"
              target="_blank"
              underline
              color="secondary"
            >
              Terms of Service
            </A>
          </p>
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Submit
          </Button>
          <div className="flex gap-2">
            <span>Already have an account?</span>
            <A href="/auth/login">Log In</A>
          </div>
        </Form>
      )}
    </Formik>
  )
}
