import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All deliveries",
  robots: { index: false, follow: false },
};

export default function AdminDeliveriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
