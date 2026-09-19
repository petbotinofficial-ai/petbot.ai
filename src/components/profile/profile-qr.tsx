"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function ProfileQr({ profileId, label = "Scan to view profile" }: { profileId: string; label?: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(`${window.location.origin}/p/${profileId}`, { margin: 1, width: 560, color: { dark: "#142d3b", light: "#fffaf1" } }).then(setSrc).catch(() => setSrc(""));
  }, [profileId]);
  return <div className="profile-qr">{src ? <img src={src} alt={label} /> : <span>Generating profile QR…</span>}<p>{label}</p></div>;
}
