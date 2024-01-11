import Image from "next/image";

export default function ImageShowcase() {
  const images = [
    {
      src: "/dashboard.png",
      description: [
        <>
          <b>Tax and MOT:</b> Populated from your registration number. These
          details are automatically updated once every 24 hours.
        </>,
        <>
          <b>Insurance:</b> A simple popup requiring your insurance start and
          end date.
        </>,
        <>
          <b>Servicing:</b> A simple popup requiring your next service due date.
        </>,
        <>
          <b>Modifications:</b> The total cost of all your modifications.
        </>,
        <>
          <b>Mileage:</b> Calculated by the current mileage of your last
          service.
        </>,
      ],
    },
    {
      src: "/modifications.png",
      description: [
        "Add a modification and upload up to three files associated with it.",
        "Each modification requires a modification type, allowing you to easily categorise them.",
        "Modification types can be renamed at any time. Safety features are built in so only empty modification types can be deleted.",
      ],
    },
    {
      src: "/servicing.png",
      description: [
        "Record your vehicle's service history.",
        "When more than one servicing has been added, VinMind will automatically show the mileage and duration of time between each service.",
      ],
    },
    {
      src: "/settings.png",
      description: [
        "Rename your vehicle or change it's registration number.",
        "Delete your vehicle at any time or it's associated data.",
      ],
    },
  ];

  return (
    <div className="bg-gray-900">
      <div className="bg-gray-900 container">
        <div className="flex flex-wrap container">
          <div className="w-full md:w-1/2 flex flex-wrap sm:justify-end">
            <div className="relative w-10/12">
              <Image
                src="/number-plate.png"
                layout="responsive"
                width={400}
                height={400}
                alt=""
                className="rounded-lg shadow-lg shadow-black"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start sm:px-10 pb-2">
            <p className="text-lg mb-2 text-white">
              Enter you number plate to retrieve the tax and MOT status of the
              vehicle.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap container">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-end sm:px-10 pb-2">
            <p className="text-lg mb-2 text-white ">
              Switch between vehicles at any time.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative w-96">
              <Image
                src="/switcher.png"
                layout="responsive"
                width={400}
                height={400}
                alt=""
                className="rounded-lg shadow-lg shadow-black"
              />
            </div>
          </div>
        </div>

        {images.map((image, index) => (
          <div key={index} className="w-full ">
            <div
              className={`flex flex-wrap ${
                index % 2 === 0 && "flex-row-reverse"
              } container`}
            >
              <div className="w-full md:w-1/2 flex flex-col justify-center items-start sm:px-10 pb-2">
                {image.description.map((paragraph, i) => (
                  <p key={i} className="text-lg mb-2 text-white">
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
                    alt={`Image ${index + 1}`}
                    className="rounded-lg shadow-lg shadow-black"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
