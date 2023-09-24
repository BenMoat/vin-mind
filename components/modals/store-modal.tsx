"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Add a Vehicle"
      description="Add a new vehicle to your garage"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Add Vehicle
    </Modal>
  );
};
