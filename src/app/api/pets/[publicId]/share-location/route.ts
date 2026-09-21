import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const validProfileId = /^[a-z0-9-]{3,80}$/;

function failure(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: NextRequest, { params }: RouteContext<"/api/pets/[publicId]/share-location">) {
  const { publicId } = await params;
  if (!validProfileId.test(publicId)) return failure("We couldn't notify the pet owner right now.", 404);

  const body = await request.json().catch(() => null) as { latitude?: unknown; longitude?: unknown; accuracy?: unknown } | null;
  const latitude = typeof body?.latitude === "number" ? body.latitude : NaN;
  const longitude = typeof body?.longitude === "number" ? body.longitude : NaN;
  const accuracy = typeof body?.accuracy === "number" ? body.accuracy : null;
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || (accuracy !== null && (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100000))) {
    return failure("We couldn't use that location. Please try again.", 400);
  }

  const supabase = await createClient();
  if (!supabase) return failure("We couldn't notify the pet owner right now.", 503);
  const { data, error: lookupError } = await supabase.rpc("create_petbot_location_alert", {
    p_public_id: publicId,
    p_accuracy_meters: accuracy,
  });
  if (lookupError || !data?.[0]) {
    const rateLimited = lookupError?.message.toLowerCase().includes("temporarily limited");
    console.error(`[pet-location] alert lookup failed for ${publicId}`, lookupError?.message);
    return failure(rateLimited ? "Location sharing is temporarily limited for this pet. Please try again later." : "We couldn't notify the pet owner right now. Please try again later.", rateLimited ? 429 : 422);
  }

  const owner = data[0] as { pet_name: string; owner_email: string };
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
  const key = process.env.RESEND_API_KEY_FOR_MAP;
  if (!key) {
    console.error(`[pet-location] missing map email configuration for ${publicId}`);
    return failure("We couldn't notify the pet owner right now. Please try again later.", 503);
  }

  const from = process.env.RESEND_FROM_EMAIL || "Petbot Alerts <onboarding@resend.dev>";
  const sharedAt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date());
  const { data: email, error: emailError } = await new Resend(key).emails.send({
    from,
    to: [owner.owner_email],
    subject: "🚨 PetBot Alert — Someone May Have Found Your Pet",
    text: `PetBot Alert\n\nSomeone scanned ${owner.pet_name}'s PetBot tag and shared their current location. They may currently be with your pet.\n\nView finder's location: ${mapsUrl}\n\nLocation shared: ${sharedAt}\nPet: ${owner.pet_name}\n\nThis is a one-time location share from the person who scanned your PetBot tag. Please use the location responsibly.\n\nMore than a tag. A way back home.\n— PetBot`,
    html: `<main style="background:#f5f0e6;color:#2e2119;font-family:Arial,sans-serif;padding:32px;max-width:600px;margin:auto"><p style="letter-spacing:2px;font-size:12px;font-weight:700">PETBOT ALERT</p><h1 style="font-family:Georgia,serif;font-size:34px;font-weight:400">Someone may have found ${owner.pet_name}.</h1><p>Someone scanned your PetBot tag and shared their current location. They may currently be with your pet.</p><p style="margin:28px 0"><a href="${mapsUrl}" style="background:#203c4b;border-radius:999px;color:#fffaf1;display:inline-block;font-weight:700;padding:14px 22px;text-decoration:none">📍 View finder’s location</a></p><p style="font-size:13px;word-break:break-all">If the button doesn’t open: <a href="${mapsUrl}">${mapsUrl}</a></p><hr style="border:0;border-top:1px solid #d9caba;margin:28px 0"><p><strong>Pet:</strong> ${owner.pet_name}<br><strong>Location shared:</strong> ${sharedAt}</p><p style="color:#66574b;font-size:13px">This is a one-time location share from the person who scanned your PetBot tag. Please use the location responsibly.</p><p style="font-family:Georgia,serif">More than a tag. A way back home.</p></main>`,
  });
  if (emailError) {
    console.error(`[pet-location] email failed for ${publicId}`, emailError.message);
    return failure("We couldn't notify the pet owner right now. Please try again later.", 502);
  }

  console.info(`[pet-location] alert sent for ${publicId}`, email?.id);
  return NextResponse.json({ success: true, message: "Location shared successfully." });
}
