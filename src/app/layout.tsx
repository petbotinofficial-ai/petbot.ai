import type { Metadata } from "next";
import { CursorGlow } from "@/components/marketing/cursor-glow";
import { FooterGate } from "@/components/marketing/footer-gate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://petbot.ai"),
  title: { default: "Petbot | Smart QR Pet Tags", template: "%s | Petbot" },
  description: "Thoughtfully made pet identity, designed to help every companion find their way home.",
  openGraph: {
    siteName: "Petbot",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col page-enter">
        <CursorGlow />
        {children}
        <FooterGate />
      </body>
    </html>
  );
}
