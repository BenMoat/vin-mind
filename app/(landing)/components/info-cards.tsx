import { useState } from "react";
import MockVehicleSwitcher, { MockVehicle } from "./mock-vehicle-switcher";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, CheckCircle, Warehouse, Wrench } from "lucide-react";

import { ModificationsCard } from "@/app/(dashboard)/[vehicleId]/(routes)/components/cards/modifications-card";
import { Button } from "@/components/ui/button";

export default function InfoCards() {
  const [showModificationsCard, setShowModificationsCard] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<MockVehicle | null>(
    null
  );

  const handleVehicleSwitch = (vehicle: MockVehicle) => {
    setSelectedVehicle(vehicle);
    setShowModificationsCard(true);
  };

  return (
    <div className="w-full max-w-full space-y-4 pt-8 mx-auto">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.5,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="flex flex-col items-center space-y-2 p-6 border rounded-lg"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
          }}
        >
          <CheckCircle className="h-6 w-6 mb-2" />
          <h2 className="text-xl font-bold">Vehicle Status</h2>
          <p>
            View your tax, MOT, and insurance status from simply inputting your
            registration number.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center space-y-2 p-6 border rounded-lg"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
          }}
        >
          <Warehouse className="h-6 w-6 mb-2" />
          <h2 className="text-xl font-bold">Your Garage</h2>
          <p>
            Manage and keep track of multiple vehicles easily and efficiently,
            all in one place.
          </p>
          <MockVehicleSwitcher onVehicleSwitch={handleVehicleSwitch} />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
          }}
          className="flex flex-col items-center space-y-2 p-6 border rounded-lg transition-opacity duration-500"
        >
          <AnimatePresence mode="wait">
            {!showModificationsCard ? (
              <motion.div
                key="modificationTracker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center flex-grow"
              >
                <div className="flex flex-col items-center">
                  <Wrench className="h-6 w-6 items-center mb-2" />
                  <h2 className="text-xl font-bold">Modification Tracker</h2>
                  <p>
                    Track and categorise modifications made to your vehicle.
                    Upload invoices, receipts or instructions of each
                    modification.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="modificationsCard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-grow"
              >
                <div>
                  <ModificationsCard
                    totalModifications={
                      selectedVehicle?.totalModifications || 2
                    }
                    totalPrice={selectedVehicle?.totalPrice || 123.92}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowModificationsCard(!showModificationsCard)}
          >
            <ArrowLeftRight />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
