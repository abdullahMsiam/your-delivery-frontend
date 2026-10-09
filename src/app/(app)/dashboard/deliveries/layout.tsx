import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My deliveries",
  robots: { index: false, follow: false },
};

export default function DeliveriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
