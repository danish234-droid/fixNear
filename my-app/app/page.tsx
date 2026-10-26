import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-fixnear-bg flex flex-col justify-center items-center px-4 py-16">
      <Card className="max-w-md w-full text-center p-6 sm:p-8">
        <div className="w-12 h-12 rounded-xl bg-fixnear-navy text-white mx-auto flex items-center justify-center font-bold text-xl shadow-xs mb-4">
          F
        </div>
        <h1 className="text-2xl font-bold text-fixnear-navy tracking-tight">
          FixNear
        </h1>
        <p className="text-sm text-fixnear-muted mt-2 leading-relaxed">
          Local Services Marketplace — Module 2, Part 1: Design Foundation.
        </p>
        <div className="mt-6 pt-6 border-t border-fixnear-border flex flex-col gap-3">
          <Link href="/design-system" className="w-full">
            <Button variant="primary" className="w-full">
              View Design System Preview →
            </Button>
          </Link>
          <span className="text-xs text-fixnear-muted">
            Design tokens, primitives & accessible states at /design-system
          </span>
        </div>
      </Card>
    </div>
  );
}
