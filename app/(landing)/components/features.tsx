import Image from "next/image";

export default function Features() {
  return (
    <>
      <section className="mb-20 scroll-mt-28" id="overview">
        <h2 className="text-4xl font-bold text-center pb-10">Overview</h2>
        <div className="relative">
          <div className="sm:inline-flex items-center border backdrop-blur rounded-lg sm:px-4 w-full sm:w-auto sm:h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
            <p className="sm:text-lg text-center px-2">
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
      </section>
      <section className="mb-20 scroll-mt-28" id="modifications">
        <h2 className="text-4xl font-bold text-center pb-10">Modifications</h2>
        <div className="relative">
          <div className="sm:inline-flex items-center border backdrop-blur rounded-lg sm:px-4 w-full sm:w-auto sm:h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
            <p className="sm:text-lg text-center px-2">
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
      </section>
      <section className="mb-20 scroll-mt-28" id="servicing">
        <h2 className="text-4xl font-bold text-center pb-10">Servicing</h2>
        <div className="relative">
          <div className="sm:inline-flex items-center border backdrop-blur rounded-lg sm:px-4 w-full sm:w-auto sm:h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
            <p className="sm:text-lg text-center px-2">
              Input the vehicle's service history for a full chronology
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Image
              src="/servicing.png"
              alt="Servicing"
              width={1920}
              height={1080}
            />
          </div>
        </div>
      </section>
      <section className="mb-20 scroll-mt-28" id="settings">
        <h2 className="text-4xl font-bold text-center pb-10">Settings</h2>
        <div className="relative">
          <div className="sm:inline-flex items-center border backdrop-blur rounded-lg sm:px-4 w-full sm:w-auto sm:h-12 absolute z-10 top-[-24px] left-1/2 transform -translate-x-1/2">
            <p className="sm:text-lg text-center px-2">
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
    </>
  );
}
