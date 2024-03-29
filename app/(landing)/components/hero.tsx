"use client";

import { version } from "@/package.json";

import Link from "next/link";
import { motion } from "framer-motion";

import { ChevronDown } from "lucide-react";

import InfoCards from "./info-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        <motion.div
          className="inline-flex justify-center pt-20 md:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-slate-500 to-blue-600 bg-clip-text text-transparent sm:relative">
            VinMind
            <Badge className="hidden sm:block sm:absolute sm:top-0 sm:right-[-80px]">
              Beta {version}
            </Badge>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="inline-flex justify-center sm:hidden">
            Beta {version}
          </Badge>
        </motion.div>
        <motion.p
          className="text-lg sm:text-xl mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your multi-vehicle management solution.
        </motion.p>
        <motion.div className="flex justify-center mt-8 space-x-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/sign-in">
              <Button variant="outline">Sign in</Button>
            </Link>
          </motion.div>
        </motion.div>
        <InfoCards />
        <div className="hidden sm:block text-center mt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button
              size="lg"
              className="rounded-full"
              onClick={scrollToNextSection}
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
