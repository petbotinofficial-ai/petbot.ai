import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. NEVER import this from a client component or expose the key to the
// browser. It bypasses Row Level Security entirely, so it is used only in two narrow,
// signature-verified server contexts: Razorpay payment verification and the Razorpay webhook,
// both of which run with no user session to rely on for RLS.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
