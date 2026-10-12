"use client";

import { useActionState, useEffect } from "react";
import { LockKeyhole } from "lucide-react";
import { loginAction, type LoginState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const START: LoginState = { message: "" };

/** Email and password for the single admin account. Errors are shown in one generic message. */
export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, START);
  // A full page load, so the admin toolbar starts with the new session.
  useEffect(() => {
    if (state.signedIn) window.location.assign("/");
  }, [state.signedIn]);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="admin-email">Email</Label>
        <Input id="admin-email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="admin-password">Password</Label>
        <Input id="admin-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.message && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-foreground">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        <LockKeyhole aria-hidden="true" />
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">Forgot password? Contact the site administrator.</p>
    </form>
  );
}
