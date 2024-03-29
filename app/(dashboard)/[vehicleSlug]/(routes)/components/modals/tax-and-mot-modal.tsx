import React from "react";

import { DvlaData } from "@prisma/client";

import { ExternalLink } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { RegChecker } from "@/components/reg-checker";

interface TaxAndMotModalProps {
  vehicleId: string;
  initialData: DvlaData | null;
  isOpen: boolean;
  onClose: () => void;
}

const description = (
  <>
    Enter your vehicle's number plate to view its up-to-date tax and MOT status
    in the <b className="text-bold">Overview</b> tab. This is directly sourced
    from the{" "}
    <a
      className="underline font-bold hover:text-primary transition-colors"
      href="https://dvladigital.blog.gov.uk/2020/03/12/dvlas-new-api-developer-portal-launch-first-api-vehicle-enquiry-service-ves-on-gov-uk/"
      target="_blank"
    >
      DVLA
      <ExternalLink className="inline-block ml-1 h-3 w-3 " />
    </a>
    .
  </>
);

export const TaxAndMOTModal: React.FC<TaxAndMotModalProps> = ({
  vehicleId,
  initialData,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      title="Tax and MOT"
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <RegChecker
        vehicleId={vehicleId}
        onClose={onClose}
        isModal
        initialData={initialData}
      />
    </Modal>
  );
};
