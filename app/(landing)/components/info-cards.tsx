import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Undo, Warehouse, Wrench } from "lucide-react";
import MockVehicleSwitcher from "./mock-vehicle-switcher";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModificationsCard } from "@/app/(dashboard)/[vehicleId]/(routes)/components/cards/modifications-card";

export default function InfoCards() {
  const [showModificationsCard, setShowModificationsCard] = useState(false);

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
          <MockVehicleSwitcher />
        </motion.div>

        <AnimatePresence mode="wait">
          {!showModificationsCard ? (
            <motion.div
              key="modificationTracker"
              className="flex flex-col items-center space-y-2 p-6 border rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Wrench className="h-6 w-6 items-center mb-2" />
              <h2 className="text-xl font-bold">Modification Tracker</h2>
              <p>
                Track and categorise modifications made to your vehicle. Upload
                invoices, receipts or instructions of each modification.
              </p>
              <Button size="sm" onClick={() => setShowModificationsCard(true)}>
                Show Modifications
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="modificationsCard"
              className="flex flex-col items-center space-y-2 p-6 border rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ModificationsCard
                totalModifications={20}
                totalPrice={1931.33}
                className="border-none"
              />
              <Button size="sm" onClick={() => setShowModificationsCard(false)}>
                Hide Modifications
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
