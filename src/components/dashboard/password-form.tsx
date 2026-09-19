"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";

export function PasswordForm() {
  const [message, setMessage] = useState("");
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") || "");
    if (password.length < 8) return setMessage("Use at least 8 characters.");
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? "We could not change your password. Sign in again and retry." : "Password changed. Use it next time you sign in.");
  }
  return <form className="settings-form" onSubmit={changePassword}><label>New password<input name="password" type="password" minLength={8} required /></label><button className="button button-dark">Change password</button>{message && <p role="status">{message}</p>}</form>;
}
