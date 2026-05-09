import { Frame } from '@/components/ui/Frame'
import LoginForm from '@/app/auth/login/LoginForm'

export const generateMetadata = () => ({
  title: 'SourceMedX - Login',
})
export default function LoginPage() {
  return (
    <Frame title="Welcome back">
      <LoginForm />
    </Frame>
  )
}
