"use client";

import InfoCards from "@/components/info-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Separator } from "@/components/ui/separator";

export default function asd() {
  const images = [
    "/dashboard.png",
    "/modifications.png",
    "/servicing.png",
    "/switcher.png",
    "/number-plate.png",
  ];

  const imageDescriptions = [
    "Fully populated dashboard",
    "Table of modifications",
    "Servicing history, including duration and mileage between services",
    "Switch between various vehicles",
    "Add your number plate to view your tax and MOT status",
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold sm:text-6xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-700">
                VinMind
              </h1>
              <p className="text-xl">Your multi-vehicle management solution.</p>
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

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2000,
                  stopOnInteraction: false,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/2"
                  >
                    <Card>
                      <CardHeader className="flex justify-center max-h-12 pb-2 pt-2">
                        {imageDescriptions[index]}
                      </CardHeader>

                      <CardContent className="flex aspect-square items-center justify-center p-1 border-t rounded-lg">
                        <img
                          src={images[index]}
                          alt={`Carousel item ${index + 1}`}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
