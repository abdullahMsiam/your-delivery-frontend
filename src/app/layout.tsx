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
  title: {
    default: "Your Delivery",
    template: "%s | Your Delivery",
  },
  description:
    "Fast, reliable parcel delivery. Track, send, and manage deliveries in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
            <ColdStartBanner/>
          </QueryProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
