import { Frame } from '@/components/ui/Frame'
import ForgotPasswordForm from '@/app/auth/forgot-password/ForgotPasswordForm'

export const generateMetadata = () => ({
  title: 'SourceMedX - Forgot Password',
})
export default function LoginPage() {
  return (
    <Frame
      title="Forgot Password"
      description="Please enter your email address to receive a verification code"
    >
      <ForgotPasswordForm />
    </Frame>
  )
}
