import { version } from "@/package.json";

import { Copyright, Gauge } from "lucide-react";

export default function Footer({ className, ...props }: any) {
  return (
    <footer className={`mt-auto px-2 ${className}`}>
      <div
        className={`flex items-center justify-center border-t h-16 text-xs sm:text-sm font-medium text-muted-foreground flex-wrap ${className}`}
      >
        <p className="w-full text-center">
          <Copyright className="inline-block mr-1 align-middle" size={16} />
          {new Date().getFullYear()} VinMind {version} &nbsp;&middot;&nbsp; All
          Rights Reserved &nbsp;&middot;&nbsp; Built by{" "}
          <a
            href="https://benmoat.dev"
            target="_blank"
            className="underline hover:text-primary transition-colors"
          >
            Ben Moat
            <Gauge className="inline-block align-middle ml-1" size={16} />
          </a>
        </p>
      </div>
    </footer>
  );
}
