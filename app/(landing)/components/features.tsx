import React from "react";

import Image from "next/image";

interface FeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
}

const Feature: React.FC<FeatureProps> = ({
  description,
  imageSrc,
  altText,
}) => (
  <div className="relative">
    <div className="sm:inline-flex items-center border backdrop-blur rounded-lg sm:px-4 w-full sm:w-auto sm:h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
      <p className="text-sm sm:text-lg text-center px-2">{description}</p>
    </div>
    <div className="border rounded-lg p-4">
      <Image src={imageSrc} alt={altText} width={1920} height={1080} />
    </div>
  </div>
);
export default function Features() {
  const features = [
    {
      title: "Dashboard",
      description:
        "An overview of your vehicle with six configurable info cards",
      imageSrc: "/dashboard.png",
      altText: "Dashboard",
    },
    {
      title: "Modifications",
      description: "Add, filter and categorise your modifications",
      imageSrc: "/modifications.png",
      altText: "Modifications",
    },
    {
      title: "Servicing",
      description: "Input the vehicle's service history for a full chronology",
      imageSrc: "/servicing.png",
      altText: "Servicing",
    },
    {
      title: "Settings",
      description: "Delete your vehicle entirely, or any of it's data",
      imageSrc: "/settings.png",
      altText: "Settings",
    },
  ];

  return (
    <section className="space-y-10">
      {features.map((feature, index) => (
        <React.Fragment key={index}>
          <h2 className="text-2xl sm:text-4xl font-bold text-center">
            {feature.title}
          </h2>
          <Feature {...feature} />
        </React.Fragment>
      ))}
    </section>
  );
}
