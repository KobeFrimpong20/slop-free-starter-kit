"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/app/auth/actions";

type Props = {
  title: string;
  submitLabel: string;
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  passwordAutoComplete: "current-password" | "new-password";
  altPrompt: string;
  altLabel: string;
  altHref: string;
};

const inputClass =
  "w-full rounded-sm border border-border bg-surface px-3 py-2 font-body text-base text-foreground focus:border-accent focus:outline-none";

export function AuthForm({
  title,
  submitLabel,
  action,
  passwordAutoComplete,
  altPrompt,
  altLabel,
  altHref,
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-24">
      <h1 className="font-heading text-4xl text-foreground">{title}</h1>

      <form action={formAction} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 font-body text-sm font-medium text-foreground">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 font-body text-sm font-medium text-foreground">
          Password
          <input
            name="password"
            type="password"
            autoComplete={passwordAutoComplete}
            minLength={8}
            required
            className={inputClass}
          />
        </label>

        {state.error && (
          <p role="alert" className="font-body text-sm text-foreground">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="font-body text-sm text-muted-foreground">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-5 py-2.5 font-body text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Working…" : submitLabel}
        </button>
      </form>

      <p className="font-body text-sm text-muted-foreground">
        {altPrompt}{" "}
        <Link href={altHref} className="text-accent underline">
          {altLabel}
        </Link>
      </p>
    </main>
  );
}
