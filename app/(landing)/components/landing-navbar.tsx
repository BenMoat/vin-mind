"use client";

import { Gauge } from "lucide-react";
import Scrollspy from "react-scrollspy";

import { NavbarMobile } from "@/components/navbar-mobile";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingNavbar = () => {
  const routes = [
    {
      href: "#overview",
      label: "Overview",
    },
    {
      href: "#modifications",
      label: "Modifications",
    },
    {
      href: "#servicing",
      label: "Servicing",
    },
    {
      href: "#settings",
      label: "Settings",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed z-[99999999] w-full border-b bg-[#060609]">
      <div className="flex h-16 items-center px-4 cursor-default">
        <NavbarMobile />
        <span className="inline-flex cursor-pointer" onClick={scrollToTop}>
          <Gauge className="w-6 h-6 ml-3 md:ml-0" />
          <p className="text-xl font-bold ml-2 mr-4">VinMind</p>
        </span>
        <Scrollspy
          items={["overview", "modifications", "servicing", "settings"]}
          offset={-100}
          currentClassName="text-white font-bold"
          className="hidden md:flex text-sm flex-grow mx-4 space-x-4 transition-colors text-muted-foreground"
        >
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </Scrollspy>

        <div className="ml-auto flex items-center space-x-2">
          <div className="hidden sm:block space-x-4">
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
