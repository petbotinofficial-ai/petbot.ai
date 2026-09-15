"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("petbot.inofficial@gmail.com");
  const [message, setMessage] = useState("");

  async function sendLink() {
    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add the public URL and publishable key in Vercel first.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setMessage(error ? "We could not send a sign-in link. Please try again." : "Check your inbox for your secure sign-in link.");
  }

  return <main className="admin-login"><section><Link href="/">← Petbot</Link><p className="eyebrow">Owner workspace</p><h1>Welcome back.</h1><p>Use your approved Petbot email to receive a secure sign-in link.</p><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="button" onClick={sendLink}>Send secure sign-in link</button>{message && <p role="status">{message}</p>}</section></main>;
}
