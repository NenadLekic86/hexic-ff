import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs - Hexic FF",
  description: "Frequently Asked Questions for Hexic FF",
};

export default function FAQs() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">FAQs</h1>
      </main>
    </div>
  );
}
