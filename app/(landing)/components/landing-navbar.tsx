"use client";

import Link from "next/link";
import Scrollspy from "react-scrollspy";
import { sectionRoutes } from "@/lib/constants";

import { Gauge } from "lucide-react";

import { LandingNavbarMobile } from "./landing-navbar-mobile";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const LandingNavbar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <motion.nav
      className="fixed z-[99999999] w-full border-b bg-[#060609]"
      initial={{ y: "-100%" }}
      animate={{
        y: "0%",
        transition: {
          duration: 0.2,
        },
      }}
    >
      <div className="flex items-center justify-between h-16 cursor-default px-4">
        <LandingNavbarMobile />
        <div className="flex items-center justify-end sm:justify-between flex-grow">
          <span
            className="flex items-center cursor-pointer"
            onClick={scrollToTop}
          >
            <Gauge className="w-6 h-6 ml-3 md:ml-0" />
            <p className="text-xl font-bold ml-2 mr-4">VinMind</p>
          </span>
          <Scrollspy
            items={["overview", "modifications", "servicing", "settings"]}
            offset={-100}
            currentClassName="text-white font-bold"
            className="hidden md:flex text-sm flex-grow mx-4 space-x-4 transition-colors text-muted-foreground"
          >
            {sectionRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="font-medium transition-colors hover:text-primary"
              >
                {route.label}
              </Link>
            ))}
          </Scrollspy>
          <div className="hidden sm:flex space-x-4">
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
