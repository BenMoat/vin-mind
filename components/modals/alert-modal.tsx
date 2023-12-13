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
  allServices?: boolean;
  service?: string;
}

const generateTitle = (props: AlertModalProps) => {
  const {
    vehicle,
    allModifications,
    allModificationTypes,
    modification,
    modificationType,
    allServices,
    service,
  } = props;

  if (vehicle)
    return `Are you sure you want to delete "${vehicle}" from your garage?`;
  if (allModifications)
    return `Are you sure you want to delete all modifications?`;
  if (allModificationTypes)
    return `Are you sure you want to delete all modification types?`;
  if (modification)
    return `Are you sure you want to delete "${modification}" from your modifications?`;
  if (modificationType)
    return `Are you sure you want to delete "${modificationType}" from your modification types?`;
  if (allServices)
    return `Are you sure you want to delete the service history?`;
  if (service)
    return `Are you sure you want to delete "${service}" from your services?`;
  return "Are you sure you want to delete this item?";
};

export const AlertModal: React.FC<AlertModalProps> = (props) => {
  const { isOpen, onClose, onConfirm, loading } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title={generateTitle(props)}
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
