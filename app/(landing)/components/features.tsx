import Image from "next/image";

export default function Features() {
  return (
    <section className="space-y-16">
      <h2 className="text-4xl font-bold text-center">Dashboard</h2>
      <div className="relative">
        <div className="inline-flex items-center border backdrop-blur rounded-lg px-4 h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
          <p className="text-lg whitespace-nowrap">
            An overview of your vehicle with six configurable info cards
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Image
            src="/dashboard.png"
            alt="Dashboard"
            width={1920}
            height={1080}
          />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-center">Modifications</h2>
      <div className="relative">
        <div className="inline-flex items-center border backdrop-blur rounded-lg px-4 h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
          <p className="text-lg whitespace-nowrap">
            Add, filter and categorise your modifications
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Image
            src="/modifications.png"
            alt="Modifications"
            width={1920}
            height={1080}
          />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-center">Servicing</h2>
      <div className="relative">
        <div className="inline-flex items-center border backdrop-blur rounded-lg px-4 h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
          <p className="text-lg whitespace-nowrap">
            Input the vehicle's service history for a full chronology
          </p>
        </div>
        <div className="flex border rounded-lg p-4 w-2/3 justify-center items-center mx-auto">
          <Image
            src="/servicing.png"
            alt="Servicing"
            layout="responsive"
            width={1920}
            height={1080}
          />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-center">Settings</h2>
      <div className="relative">
        <div className="inline-flex items-center border backdrop-blur rounded-lg px-4 h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
          <p className="text-lg whitespace-nowrap">
            Delete your vehicle entirely, or any of it's data
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Image
            src="/settings.png"
            alt="Settings"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </section>
  );
}
