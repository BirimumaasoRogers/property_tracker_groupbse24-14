import { MapPin } from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
        <div className="flex flex-col px-12 items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PropertyTracker. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
  );
}