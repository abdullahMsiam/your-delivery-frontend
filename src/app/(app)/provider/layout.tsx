import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent overview",
  robots: { index: false, follow: false },
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
