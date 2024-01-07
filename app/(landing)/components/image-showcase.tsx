import Image from "next/image";

export default function ImageShowcase() {
  const images = [
    "/dashboard.png",
    "/modifications.png",
    "/servicing.png",
    "/settings.png",
  ];

  const imageDescriptions = [
    `<p class="mb-2">Your dashboard provides an overview of your vehicle through six configurable info cards.</p>
    <p class="mb-2"><b>Tax and MOT</b>: Populated from your registration number. These details are automatically updated once every 24 hours.
    <i>Click on the question mark icon to see when it was last updated</i>.</p>
    <p class="mb-2"><b>Insurance</b>: A simple popup requiring your insurance start and end date.</p>
    <p class="mb-2"><b>Servicing</b>: Determined by your next service due date.</p>
    <p class="mb-2"><b>Modifications</b>: The total cost of all your modifications.</p>
    <p class="mb-2"><b>Mileage</b>: Calculated by the current mileage of your last service.</p>`,

    `<p class="mb-2">VinMind has a dedicated section for modifications.</p> 
    <p class="mb-2">Add a modification and upload up to <b>three</b> files associated with it.</p>
    <p class="mb-2">Each modification requires a <b>modification type</b>, allowing you to easily categorise them.</p>
    <p>Modification types can be renamed at any time. Safety features are built in so only empty modification types can be deleted.</p>
    `,
    `<p class="mb-2">Record your vehicle's service history.</p>
    <p>When more than one servicing has been added, VinMind will automatically show the mileage and duration of time between each service.</p> 
    `,
    `<p class="mb-2">Rename your vehicle or change it's registration number.</p>
    <p class="mb-2">Delete your vehicle at any time or it's associated data.</p>`,
  ];

  return (
    <>
      {images.map((image, index) => (
        <div key={index} className="w-full px-10 bg-gray-900">
          <div
            className={`flex flex-wrap ${
              index % 2 === 0 && "flex-row-reverse"
            } container`}
          >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start sm:px-10 pb-2">
              <p
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: imageDescriptions[index] }}
              ></p>
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
