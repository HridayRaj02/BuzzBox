import AuthForm from '../components/AuthForm.jsx'
import AuthPageLayout from '../components/AuthPageLayout.jsx'

export default function LoginPage() {
  return <AuthPageLayout hideMoney><AuthForm mode="login" /></AuthPageLayout>
}
