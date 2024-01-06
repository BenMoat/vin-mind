import React from "react";

import {
  CarIcon,
  Info,
  LucideProps,
  MenuSquare,
  MergeIcon,
  RectangleHorizontal,
  SettingsIcon,
  Warehouse,
} from "lucide-react";

export default function InfoCards() {
  return (
    <div className="w-full max-w-full space-y-4 pt-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
          <div>
            <Warehouse className="h-6 w-6 mb-2" />
          </div>
          <h2 className="text-xl font-bold">Your Garage</h2>
          <p>
            Manage and keep track of multiple vehicles easily and efficiently,
            all in one place.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
          <div>
            <MenuSquare className="h-6 w-6 mb-2 " />
          </div>
          <h2 className="text-xl font-bold">Info Cards</h2>
          <p>
            View your tax, MOT, and insurance status at a glance, all from the
            Overview tab.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
          <div>
            <RectangleHorizontal className="h-6 w-6 mb-2" />
          </div>
          <h2 className="text-xl ">Advanced Customization</h2>
          <p>
            With Advanced Customization, you can personalize your email client
            to suit your preferences and work style.
          </p>
        </div>
      </div>
    </div>
  );
}
