import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Programme - Hexic FF",
  description: "Partner Programme for Hexic FF",
};

export default function PartnerProgramme() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Partner Programme</h1>
      </main>
    </div>
  );
}
