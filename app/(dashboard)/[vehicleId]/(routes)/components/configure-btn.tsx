"use client";

import { useState } from "react";

import { DashboardConfigure } from "@prisma/client";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfigureModal } from "./modals/configure-modal";

interface ConfigureProps {
  initialData: DashboardConfigure;
}

export const ConfigureBtn: React.FC<ConfigureProps> = ({ initialData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ConfigureModal
        initialData={initialData}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Settings className="sm:mr-2 h-4 w-4" />
        <span className="hidden sm:block">Configure</span>
      </Button>
    </>
  );
};
