"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("petbot.inofficial@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signIn() {
    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add the public URL and publishable key in Vercel first.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? "Incorrect email or password. Use ‘Set password’ if this is your first time." : "Signed in. Opening your workspace…");
    if (!error) window.location.assign("/admin");
  }

  return <main className="admin-login"><section><Link href="/">← Petbot</Link><p className="eyebrow">Owner workspace</p><h1>Welcome back.</h1><p>Sign in with your Petbot owner email and password.</p><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={signIn}>Sign in</button><Link className="password-link" href="/admin/set-password">First time? Set password</Link>{message && <p role="status">{message}</p>}</section></main>;
}
