import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default function AgentProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
