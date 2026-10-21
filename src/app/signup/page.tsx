import { AuthForm } from "@/components/auth-form";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <AuthForm
      title="Create your account"
      submitLabel="Sign up"
      action={signup}
      passwordAutoComplete="new-password"
      altPrompt="Already have an account?"
      altLabel="Log in"
      altHref="/login"
    />
  );
}
