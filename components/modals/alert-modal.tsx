"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  vehicle?: string;
  allModifications?: boolean;
  allModificationTypes?: boolean;
  modification?: string;
  modificationType?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  vehicle,
  allModifications,
  allModificationTypes,
  modification,
  modificationType,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title={
        vehicle
          ? `Are you sure you want to delete "${vehicle}" from your garage?`
          : allModifications
          ? `Are you sure you want to delete all modifications?`
          : allModificationTypes
          ? `Are you sure you want to delete all modification types?`
          : modification
          ? `Are you sure you want to delete "${modification}" from your modifications?`
          : modificationType
          ? `Are you sure you want to delete "${modificationType}" from your modification types?`
          : "Are you sure you want to delete this item?"
      }
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
