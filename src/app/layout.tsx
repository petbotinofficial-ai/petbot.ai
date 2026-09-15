import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petbot | A way back home",
  description: "Thoughtfully made pet identity, designed to help every companion find their way home.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
