import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New delivery",
  robots: { index: false, follow: false },
};

export default function NewDeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
