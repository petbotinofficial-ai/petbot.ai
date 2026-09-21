"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useEffect, useState } from "react";
import { ShareLocation } from "@/components/profile/share-location";

type Profile = { public_id: string; pet_name: string; breed: string | null; public_message: string | null; is_friendly: boolean | null; is_ready: boolean; owner_phone: string | null; owner_address: string | null; share_address: boolean };

const sample: Profile = { public_id: "sample-tommy", pet_name: "Tommy", breed: "Golden Retriever", public_message: "I love treats and gentle pats. Please help me get home.", is_friendly: true, is_ready: true, owner_phone: "+91 99xxxxxxxx", owner_address: null, share_address: false };

export function PublicProfile({ profileId }: { profileId: string }) {
  const [profile, setProfile] = useState<Profile | null>(profileId === "sample-tommy" ? sample : null);
  const [loading, setLoading] = useState(profileId !== "sample-tommy");
  const [message, setMessage] = useState("");

  async function load() {
    const supabase = createClient();
    if (!supabase) return setMessage("This profile is not available right now.");
    const { data, error } = await supabase.rpc("get_petbot_profile", { p_public_id: profileId });
    setLoading(false);
    if (error || !data?.[0]) return setMessage("We could not find this Petbot profile.");
    setProfile(data[0] as Profile);
  }

  useEffect(() => {
    if (profileId === "sample-tommy") return;
    const loadProfile = async () => {
      const supabase = createClient();
      if (!supabase) return setMessage("This profile is not available right now.");
      const { data, error } = await supabase.rpc("get_petbot_profile", { p_public_id: profileId });
      setLoading(false);
      if (error || !data?.[0]) return setMessage("We could not find this Petbot profile.");
      setProfile(data[0] as Profile);
    };
    void loadProfile();
  }, [profileId]);

  async function activate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.rpc("activate_petbot_profile", {
      p_public_id: profileId,
      p_pet_name: String(form.get("pet_name") || ""),
      p_is_friendly: form.get("friendly") === "yes",
      p_owner_phone: String(form.get("phone") || ""),
      p_owner_address: String(form.get("address") || ""),
      p_share_address: form.get("share_address") === "on",
      p_public_message: String(form.get("message") || ""),
    });
    if (error) return setMessage(error.message);
    setMessage("Profile saved. It is now ready whenever this tag is scanned.");
    void load();
  }

  if (loading) return <main className="public-profile-page"><p>Opening Petbot profile…</p></main>;
  if (!profile) return <main className="public-profile-page"><p>{message || "Profile not found."}</p></main>;
  if (!profile.is_ready) return <main className="public-profile-page"><section className="profile-card"><p className="eyebrow">First scan setup</p><h1>Make {profile.pet_name}&rsquo;s tag ready.</h1><p>Complete these details once. Future scans will show the safe profile below.</p><form onSubmit={activate} className="profile-form"><label>Pet name<input name="pet_name" defaultValue={profile.pet_name} required /></label><fieldset><legend>Are they friendly?</legend><label><input type="radio" name="friendly" value="yes" required /> Yes, friendly</label><label><input type="radio" name="friendly" value="no" /> Please approach carefully</label></fieldset><label>Contact number<input name="phone" type="tel" required placeholder="+91 98765 43210" /></label><label>Message for a finder<textarea name="message" rows={3} placeholder="I love treats. Please call my family." /></label><label>Address <span>(optional)</span><textarea name="address" rows={2} placeholder="Only share this if you want it visible." /></label><label className="checkbox-line"><input type="checkbox" name="share_address" /> Show my address on this profile</label><button className="button button-dark">Activate profile</button>{message && <p role="status">{message}</p>}</form></section></main>;

  const sampleProfile = profile.public_id === "sample-tommy";
  return <main className="public-profile-page"><section className="profile-card profile-live"><p className="eyebrow">Petbot profile · Safe return</p><div className="profile-avatar">🐾</div><h1>{profile.pet_name}</h1><p className="profile-breed">{profile.breed || "Petbot companion"}</p><p className={`friendly-status ${profile.is_friendly ? "friendly" : "careful"}`}>{profile.is_friendly ? "Friendly — please say hello" : "Please approach carefully"}</p>{profile.public_message && <blockquote>“{profile.public_message}”</blockquote>}<div className="profile-contact"><strong>Help me get home</strong>{sampleProfile ? <span className="sample-phone">{profile.owner_phone}</span> : <a href={`tel:${profile.owner_phone?.replace(/[^+\d]/g, "")}`}>{profile.owner_phone}</a>}{profile.share_address && profile.owner_address && <span>{profile.owner_address}</span>}</div>{!sampleProfile && <ShareLocation profileId={profile.public_id} />}<p className="profile-note">Thank you for helping {profile.pet_name} find their way back home.</p></section></main>;
}
