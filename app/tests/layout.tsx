"use client";

import PublisherContent from "@/app/components/PublisherContent";

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PublisherContent />
    </>
  );
}
