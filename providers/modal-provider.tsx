"use client";

import { useEffect, useState } from "react";

import { VehicleModal } from "@/components/modals/vehicle-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <VehicleModal />
    </>
  );
};
