import RegisterPage from "./register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Page | FindEra",
  description: "Create your account and start reporting lost or found items."
};

export default function Page() {
  return <RegisterPage />;
}
