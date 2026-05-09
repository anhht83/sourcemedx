import { Frame } from '@/components/ui/Frame'
import ResetPasswordForm from '@/app/auth/reset-password/ResetPasswordForm'

export const generateMetadata = () => ({
  title: 'SourceMedX - Reset Password',
})
export default function LoginPage() {
  return (
    <Frame title="Reset Password" description="Please enter your new password">
      <ResetPasswordForm />
    </Frame>
  )
}
