import Image from "next/image";

export default function ImageShowcase() {
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
      {images.map((image, index) => (
        <div key={index} className="w-full px-10 bg-gray-900">
          <div
            className={`flex flex-wrap ${
              index % 2 === 0 ? "flex-row-reverse" : ""
            } container`}
          >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start sm:pl-10 pb-2">
              <p className="text-lg">{imageDescriptions[index]}</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
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
        </div>
      ))}
    </>
  );
}
