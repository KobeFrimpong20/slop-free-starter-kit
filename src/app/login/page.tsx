import { AuthForm } from "@/components/auth-form";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      action={login}
      passwordAutoComplete="current-password"
      altPrompt="No account yet?"
      altLabel="Sign up"
      altHref="/signup"
    />
  );
}
