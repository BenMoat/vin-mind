import { Modal } from "@/components/ui/modal";
import React from "react";
import { RegChecker } from "../settings/components/reg-checker";
import { DvlaData } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface TaxAndMotModalProps {
  initialData: DvlaData | null;
  isOpen: boolean;
  onClose: () => void;
}

const description = (
  <>
    Enter your vehicle's number plate to view its up-to-date tax and MOT status
    in the <b>Overview</b> tab. This is directly sourced from the{" "}
    <a
      className="underline font-bold hover:text-primary transition-colors"
      href="https://dvladigital.blog.gov.uk/2020/03/12/dvlas-new-api-developer-portal-launch-first-api-vehicle-enquiry-service-ves-on-gov-uk/"
      target="_blank"
    >
      DVLA
    </a>
    .
  </>
);

export const TaxAndMOTModal: React.FC<TaxAndMotModalProps> = ({
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
      <RegChecker onClose={onClose} isModal initialData={initialData} />
    </Modal>
  );
};
