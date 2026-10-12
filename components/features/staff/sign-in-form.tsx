"use client";

import { useActionState } from "react";
import { CircleAlert, Loader2, LogIn } from "lucide-react";
import { signIn, type SignInState } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: SignInState = { message: "" };

/** Staff sign-in with email and password; the Server Action checks the editors list. */
export default function SignInForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="staff-email">College email</Label>
        <Input id="staff-email" name="email" type="email" autoComplete="username" required aria-invalid={Boolean(state.message)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="staff-password">Password</Label>
        <Input id="staff-password" name="password" type="password" autoComplete="current-password" required aria-invalid={Boolean(state.message)} />
      </div>
      {state.message && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertDescription className="text-foreground">{state.message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 aria-hidden="true" className="animate-spin" /> : <LogIn aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
