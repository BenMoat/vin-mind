import Link from "next/link";

import ImageShowcase from "./components/image-showcase";
import InfoCards from "./components/info-cards";

import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <>
      <section className="w-full bg-[#060609]">
        <div className="container px-4 md:px-6 dark">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-8 text-center">
              <div className="space-y-6 pt-10 sm:pt-20">
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-900">
                  VinMind
                </h1>
                <p className="text-xl text-white">
                  Your multi-vehicle management solution.
                </p>
                <div className="space-x-4">
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline" className="text-white">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              <InfoCards />
            </div>
          </div>
        </div>
      </section>
      <div className="bg-gradient-to-b from-black to-gray-900 min-h-[180px] flex items-center justify-center">
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
