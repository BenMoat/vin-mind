"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { ConfigureModal } from "./configure-modal";
import { DashboardConfigure } from "@prisma/client";

interface ConfigureProps {
  initialData: DashboardConfigure;
}

export const Configure: React.FC<ConfigureProps> = ({ initialData }) => {
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
