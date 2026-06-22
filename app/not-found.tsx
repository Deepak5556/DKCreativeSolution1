import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-7xl font-bold text-gradient-gold">404</h1>
      <h2 className="mt-4 font-display text-2xl font-semibold text-white">Page Not Found</h2>
      <p className="mt-2 text-dk-muted max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
