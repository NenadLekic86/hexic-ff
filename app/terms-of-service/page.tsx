import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Hexic FF",
  description: "Terms of Service for Hexic FF",
};

export default function TermsOfService() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
      </main>
    </div>
  );
}
