import { CheckCircle, Warehouse, Wrench } from "lucide-react";

export default function InfoCards() {
  return (
    <div className="w-full max-w-full space-y-4 pt-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
          <Warehouse className="h-6 w-6 mb-2" />
          <h2 className="text-xl font-bold">Your Garage</h2>
          <p>
            Manage and keep track of multiple vehicles easily and efficiently,
            all in one place.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
          <CheckCircle className="h-6 w-6 mb-2 " />
          <h2 className="text-xl font-bold">Vehicle Status</h2>
          <p>
            View your tax, MOT, and insurance status from simply inputting your
            registration number.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-6 border rounded-lg">
          <Wrench className="h-6 w-6 mb-2 " />
          <h2 className="text-xl font-bold">Modification Tracker</h2>
          <p>
            Track and categorise modifications made to your vehicle. Upload
            invoices, receipts or instructions of each modification.
          </p>
        </div>
      </div>
    </div>
  );
}
