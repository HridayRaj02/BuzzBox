import AuthForm from '../components/AuthForm.jsx'
import AuthPageLayout from '../components/AuthPageLayout.jsx'

export default function LoginPage() {
  return <AuthPageLayout><AuthForm mode="login" /></AuthPageLayout>
}
