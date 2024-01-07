"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import InfoCards from "@/components/info-cards";

export default function LandingPage() {
  const images = [
    "/dashboard.png",
    "/modifications.png",
    "/servicing.png",
    "/switcher.png",
    "/number-plate.png",
  ];

  const imageDescriptions = [
    "Your dashboard provides an overview of your vehicle. It includes your tax, MOT, and insurance status, as well as your vehicle's details.",
    "Table of modifications",
    "Servicing history, including duration and mileage between services",
    "Switch between various vehicles",
    "Add your number plate to view your tax and MOT status",
  ];

  return (
    <>
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-8 text-center">
              <div className="space-y-6 pt-20">
                <h1 className="text-3xl font-bold sm:text-6xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-900">
                  VinMind
                </h1>
                <p className="text-xl">
                  Your multi-vehicle management solution.
                </p>
                <div className="space-x-4">
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline">Log in</Button>
                  </Link>
                </div>
              </div>
              <InfoCards />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-t from-gray-900 to-black min-h-[220px] mt-[-40px] flex items-center justify-center">
          <h2 className="text-4xl font-bold text-center">Features</h2>
        </div>
      </section>
      {images.map((image, index) => (
        <section key={index} className="w-full bg-gray-900">
          <div
            className={`flex flex-wrap ${
              index % 2 === 0 ? "flex-row-reverse" : ""
            } container mx-auto`}
          >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start pl-10 py-5">
              <p className="text-xl text-white">{imageDescriptions[index]}</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative pb-1">
                <Image
                  src={image}
                  layout="responsive"
                  width={400}
                  height={400}
                  objectFit="fill"
                  alt={`Image ${index + 1}`}
                  className="rounded-lg shadow-lg shadow-black"
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
