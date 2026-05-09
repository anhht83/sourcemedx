import { Frame } from '@/components/ui/Frame'
import RegisterForm from '@/app/auth/register/RegisterForm'

export const generateMetadata = () => ({
  title: 'SourceMedX - Register',
})
export default function RegisterPage() {
  return (
    <Frame title="Register">
      <RegisterForm />
    </Frame>
  )
}
