import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageShowcase() {
  const { resolvedTheme } = useTheme();

  const images = [
    {
      src:
        resolvedTheme === "light"
          ? "/dashboard-light.png"
          : "/dashboard-dark.png",
      description: [
        "Your dashboard provides an overview of your vehicle through six configurable info cards.",
        "Tax and MOT: Populated from your registration number. These details are automatically updated once every 24 hours. Click on the question mark icon to see when it was last updated.",
        "Insurance: A simple popup requiring your insurance start and end date.",
        "Servicing: Determined by your next service due date.",
        "Modifications: The total cost of all your modifications.",
        "Mileage: Calculated by the current mileage of your last service.",
      ],
    },
    {
      src:
        resolvedTheme === "light"
          ? "/modifications-light.png"
          : "/modifications-dark.png",
      description: [
        "VinMind has a dedicated section for modifications.",
        "Add a modification and upload up to three files associated with it.",
        "Each modification requires a modification type, allowing you to easily categorise them.",
        "Modification types can be renamed at any time. Safety features are built in so only empty modification types can be deleted.",
      ],
    },
    {
      src:
        resolvedTheme === "light"
          ? "/servicing-light.png"
          : "/servicing-dark.png",
      description: [
        "Record your vehicle's service history.",
        "When more than one servicing has been added, VinMind will automatically show the mileage and duration of time between each service.",
      ],
    },
    {
      src:
        resolvedTheme === "light"
          ? "/settings-light.png"
          : "/modifications-dark.png",
      description: [
        "Rename your vehicle or change it's registration number.",
        "Delete your vehicle at any time or it's associated data.",
      ],
    },
  ];

  return (
    <>
      {images.map((image, index) => (
        <div key={index} className="w-full px-10 bg-gray-300 dark:bg-gray-900">
          <div
            className={`flex flex-wrap ${
              index % 2 === 0 && "flex-row-reverse"
            } container`}
          >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start sm:px-10 pb-2">
              {image.description.map((paragraph, i) => (
                <p key={i} className="text-lg mb-2 text-black dark:text-white">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <Image
                  src={image.src}
                  layout="responsive"
                  width={400}
                  height={400}
                  objectFit="fill"
                  alt={`Image ${index + 1}`}
                  className="rounded-lg shadow-lg shadow-gray-600 dark:shadow-black"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
