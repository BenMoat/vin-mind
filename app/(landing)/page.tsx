"use client";

import React, { useRef } from "react";
import Link from "next/link";

import { ChevronDown } from "lucide-react";

import ImageShowcase from "./components/image-showcase";
import InfoCards from "./components/info-cards";

import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="w-full sm:min-h-screen flex flex-col justify-center bg-[#060609] ">
        <div className="container flex flex-col min-h-screen justify-center text-center text-white">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-slate-500 to-blue-700 bg-clip-text text-transparent">
            VinMind
          </h1>
          <p className="text-lg sm:text-xl mt-4">
            Your multi-vehicle management solution.
          </p>
          <div className="mt-8 space-x-4">
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Log in</Button>
            </Link>
          </div>
          <div>
            <InfoCards />
          </div>
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="rounded-full"
              onClick={scrollToFeatures}
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>
      <div
        className="bg-gradient-to-b from-black to-gray-900 min-h-[180px] flex items-center justify-center"
        ref={featuresRef}
      >
        <h2 className="text-4xl font-bold text-center text-white">Features</h2>
      </div>
      <section>
        <ImageShowcase />
      </section>
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-[220px] mt-[-100px]"></div>
      <Footer className="bg-[#060609] border-[#060609]" />
    </>
  );
}
