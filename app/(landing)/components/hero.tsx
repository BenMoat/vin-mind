import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import InfoCards from "./info-cards";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("overview");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="w-full sm:min-h-screen flex flex-col justify-center "
    >
      <div className="flex flex-col min-h-screen justify-center text-center pb-20 sm:pb-0">
        <div className="inline-flex justify-center pt-20 md:pt-0">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-slate-500 to-blue-600 bg-clip-text text-transparent">
            VinMind
          </h1>
        </div>
        <p className="text-lg sm:text-xl mt-4">
          Your multi-vehicle management solution.
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
        <div>
          <InfoCards />
        </div>
        <div className="hidden sm:block text-center mt-8">
          <Button
            size="lg"
            className="rounded-full"
            onClick={scrollToNextSection}
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
