import { Suspense } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/button";
import { createClient } from "@/lib/supabase/server";

async function AccountDetails() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <p className="font-body text-base text-muted-foreground">
        Signed in as <span className="font-accent text-foreground">{user.email}</span>
      </p>
      <form action={logout}>
        <Button type="submit" variant="secondary">
          Log out
        </Button>
      </form>
    </>
  );
}

export default function AccountPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="font-heading text-4xl text-foreground">Account</h1>
      <Suspense fallback={<p className="font-body text-muted-foreground">Loading…</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  );
}
