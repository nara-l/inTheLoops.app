import { ParallaxHeader } from "@/components/ParallaxHeader";
import { ImportForm } from "@/components/ImportForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <ParallaxHeader
          title="I looped you in!"
          subtitle="I saved you the best bits, so you don't scroll forever."
        />
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="soft-card rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-2">Paste Exported JSON</h2>
            <ImportForm />
          </div>
          <div className="soft-card rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-2">Try the Demo</h2>
            <p className="text-sm text-[color:var(--color-muted)] mb-3">Explore a sample conversation with reactions and themes.</p>
            <Link href="/view/demo1" className="btn-pill">Open Demo</Link>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link href="/curate" className="underline text-sm">Curate Your Loop</Link>
        </div>
        {/* Removed framework credit line per request */}
      </div>
    </div>
  );
}

