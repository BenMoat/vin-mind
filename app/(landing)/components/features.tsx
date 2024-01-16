"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

import { useInView } from "react-intersection-observer";
import { sectionRoutes } from "@/lib/constants";

import Image from "next/image";

import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type SectionProps = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0 });
};

const Section = ({
  id,
  title,
  description,
  imageSrc,
  imageAlt,
  isLast,
}: SectionProps & { isLast: boolean }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <motion.section
      className="scroll-mt-28"
      id={id}
      ref={ref}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            duration: 1.5,
          },
        },
      }}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <h2 className="text-2xl sm:text-4xl font-bold text-center pb-10">
        {title}
      </h2>
      <div className="relative">
        <div className="sm:inline-flex items-center border backdrop-blur rounded-lg sm:px-4 w-full sm:w-auto sm:h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
          <p className="text-sm sm:text-md text-center py-2 sm:py-0">
            {description}
          </p>
        </div>
        <div className="relative flex justify-center">
          <div className="border rounded-lg p-4 sm:w-3/4 flex justify-center items-center">
            <Image src={imageSrc} alt={imageAlt} width={1920} height={1080} />
          </div>
        </div>
      </div>
      {isLast ? (
        <div className="text-center pt-10 pb-4 sm:pt-14 sm:pb-12">
          <Button size="lg" className="rounded-full" onClick={scrollToTop}>
            <ChevronUp className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center my-8 sm:my-16 h-8 sm:h-20 w-1 rounded-full bg-muted mx-auto"></div>
      )}
    </motion.section>
  );
};

export default function Features() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const imageSrcs = [
    "/dashboard.png",
    "/modifications.png",
    "/servicing.png",
    "/settings.png",
  ];

  const descriptions = [
    "An overview of your vehicle with six configurable info cards",
    "Add, filter and categorise your modifications",
    "Input the vehicle's service history for a full service chronology",
    "Rename or delete your vehicle and any of it's associated data",
  ];

  return (
    <>
      {sectionRoutes.map((route, index) => (
        <Section
          key={route.href}
          id={route.href.slice(1)} //Remove the # from the href
          title={route.label}
          description={descriptions[index]}
          imageSrc={imageSrcs[index]}
          imageAlt={route.label}
          isLast={index === sectionRoutes.length - 1}
        />
      ))}
    </>
  );
}
