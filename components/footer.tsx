import { Copyright, GithubIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="flex items-center justify-center border-t h-16 text-xs sm:text-sm font-medium text-muted-foreground">
        <p>
          <Copyright className="inline-block mr-1 align-middle" size={16} />
          {new Date().getFullYear()} VinMind &nbsp;&middot;&nbsp; All Rights
          Reserved &nbsp;&middot;&nbsp; Built by{" "}
          <a
            href="https://github.com/BenMoat"
            target="_blank"
            className="underline hover:text-primary transition-colors"
          >
            Ben Moat
            <GithubIcon className="inline-block align-middle ml-1" size={16} />
          </a>
        </p>
      </div>
    </footer>
  );
}