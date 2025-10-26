import type { Metadata } from "next";
import "./globals.css";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "ElevenLabs Studio",
  description: "Craft rich voice experiences with ElevenLabs directly from your browser."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={clsx(
        "min-h-screen bg-[radial-gradient( circle_at_top,_#1b1536,_#05030d_70%)]",
        "text-slate-100 antialiased"
      )}
    >
      {children}
    </body>
  </html>
);

export default RootLayout;
