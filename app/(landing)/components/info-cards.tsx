import { motion } from "framer-motion";
import { CheckCircle, Warehouse, Wrench } from "lucide-react";
import MockVehicleSwitcher from "./mock-vehicle-switcher";

const cards = [
  {
    Icon: CheckCircle,
    title: "Vehicle Status",
    description:
      "View your tax, MOT, and insurance status from simply inputting your registration number.",
  },
  {
    Icon: Warehouse,
    title: "Your Garage",
    description:
      "Manage and keep track of multiple vehicles easily and efficiently, all in one place.",
  },
  {
    Icon: Wrench,
    title: "Modification Tracker",
    description:
      "Track and categorise modifications made to your vehicle. Upload invoices, receipts or instructions of each modification.",
  },
];

export default function InfoCards() {
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
        {cards.map(({ Icon, title, description }) => (
          <motion.div
            key={title}
            className="flex flex-col items-center space-y-2 p-6 border rounded-lg"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 },
            }}
          >
            <Icon className="h-6 w-6 mb-2" />
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{description}</p>
            {title === "Your Garage" && <MockVehicleSwitcher />}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
