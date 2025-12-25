import { Metadata } from "next"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Login Page | FindEra",
}

const LoginPage = () => {
  return <LoginForm />
}

export default LoginPage