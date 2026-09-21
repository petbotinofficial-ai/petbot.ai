"use client";

import { useState } from "react";

type State = "idle" | "locating" | "notifying" | "success" | "denied" | "unavailable" | "timeout" | "error";

export function ShareLocation({ profileId }: { profileId: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function share() {
    if (!navigator.geolocation) {
      setState("unavailable");
      setMessage("We couldn't determine your current location. Please check your device's location services and try again.");
      return;
    }
    setState("locating");
    setMessage("");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        setState("error");
        setMessage("We couldn't use that location. Please try again.");
        return;
      }
      setState("notifying");
      try {
        const response = await fetch(`/api/pets/${encodeURIComponent(profileId)}/share-location`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ latitude, longitude, accuracy }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) throw new Error(result.error || "Unable to notify the pet owner.");
        setState("success");
        setMessage("Thank you for helping bring this pet home. The pet owner has been notified with your current location.");
      } catch (error) {
        setState("error");
        setMessage(error instanceof Error ? error.message : "We couldn't notify the pet owner right now. Please try again later.");
      }
    }, (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setState("denied");
        setMessage("Location access was denied. Please allow location access in your browser and try again if you want to share your location with the pet owner.");
      } else if (error.code === error.TIMEOUT) {
        setState("timeout");
        setMessage("Getting your location took too long. Please check your location services and try again.");
      } else {
        setState("unavailable");
        setMessage("We couldn't determine your current location. Please check your device's location services and try again.");
      }
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
  }

  if (state === "success") return <section className="finder-location finder-location-success" aria-live="polite"><p className="eyebrow">✓ Location shared</p><h2>Thank you for helping.</h2><p>{message}</p></section>;
  const busy = state === "locating" || state === "notifying";
  const buttonText = state === "locating" ? "📍 Getting your location…" : state === "notifying" ? "📨 Notifying owner…" : state === "denied" || state === "unavailable" || state === "timeout" || state === "error" ? "Try again" : "📍 Share my location";
  return <section className="finder-location" aria-live="polite"><p className="eyebrow">🐾 Found this pet?</p><h2>Help them get home.</h2><p>If you have found this pet, you can share your current location with the owner so they can find you and reunite with their pet.</p><button type="button" className="button button-dark" onClick={share} disabled={busy}>{buttonText}</button><small>Your location will be shared once with the pet owner. PetBot does not continuously track your location.</small>{message && <p className="finder-location-message" role="status">{message}</p>}</section>;
}
