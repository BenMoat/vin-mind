import { CheckCircle, Warehouse, Wrench } from "lucide-react";

const cards = [
  {
    Icon: Warehouse,
    title: "Your Garage",
    description:
      "Manage and keep track of multiple vehicles easily and efficiently, all in one place.",
  },
  {
    Icon: CheckCircle,
    title: "Vehicle Status",
    description:
      "View your tax, MOT, and insurance status from simply inputting your registration number.",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        {cards.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center space-y-2 p-6 border rounded-lg"
          >
            <Icon className="h-6 w-6 mb-2" />
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
