import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assigned deliveries",
  robots: { index: false, follow: false },
};

export default function AgentDeliveriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
