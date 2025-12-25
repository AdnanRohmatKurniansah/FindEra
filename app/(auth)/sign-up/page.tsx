import RegisterPage from "./register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Page | FindEra",
};

export default function Page() {
  return <RegisterPage />;
}
