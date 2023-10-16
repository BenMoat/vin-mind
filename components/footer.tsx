import { Copyright, GithubIcon } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="border-t fixed bottom-0 w-full">
        <div className="flex items-center justify-center h-16 px-4 space-x-2 text-sm font-medium text-muted-foreground">
          <p>
            <Copyright className="inline-block mr-1 align-middle" size={16} />
            {new Date().getFullYear()} VinMind &nbsp;&middot;
          </p>
          <p>All rights reserved &nbsp;&middot;</p>
          <p>
            Built by&nbsp;
            <a
              href="https://github.com/BenMoat"
              target="_blank"
              className="underline hover:text-primary transition-colors"
            >
              Ben Moat
              <GithubIcon
                className="inline-block align-middle ml-1"
                size={16}
              />
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
