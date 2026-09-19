"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function SetPasswordPage() {
  const [email, setEmail] = useState("petbot.inofficial@gmail.com"); const [password, setPassword] = useState(""); const [message, setMessage] = useState("");
  async function sendSetup() { const supabase = createClient(); if (!supabase) return; const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/admin/set-password` }); setMessage(error ? "We could not send the password setup email." : "Check your inbox. Open the one-time setup link, then return here to choose a password."); }
  async function savePassword() { const supabase = createClient(); if (!supabase) return; const { error } = await supabase.auth.updateUser({ password }); setMessage(error ? "Open the setup link from your email first, then choose a password of at least 8 characters." : "Password saved. You can now sign in without email links."); }
  return <main className="admin-login"><section><Link href="/admin/login">← Sign in</Link><p className="eyebrow">One-time setup</p><h1>Set password.</h1><p>Use the email link only once to set your password. Future dashboard logins use email and password.</p><label>Email</label><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /><button type="button" onClick={sendSetup}>Send setup email</button><label>New password</label><input value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} type="password" /><button type="button" onClick={savePassword}>Save password</button>{message && <p role="status">{message}</p>}</section></main>;
}
