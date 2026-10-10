import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthSync } from "@/components/layout/auth-sync";
import { BackendWarmer } from "@/components/providers/backend-warmer";
import { ColdStartBanner } from "@/components/shared/cold-start-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Your Delivery",
    template: "%s | Your Delivery",
  },
  description:
    "Fast, reliable parcel delivery. Track, send, and manage deliveries in real time.",
  applicationName: "Your Delivery",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Your Delivery",
    description: "Fast, reliable parcel delivery.",
    siteName: "Your Delivery",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Your Delivery",
    description: "Fast, reliable parcel delivery.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          content="#dc2626"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#dc2626"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <BackendWarmer />
            <AuthSync>{children}</AuthSync>
            <ColdStartBanner />
          </QueryProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
