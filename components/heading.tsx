"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  goBack?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  goBack,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center">
      {goBack && (
        <Button
          className="mr-4 flex-shrink-0 h-14"
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground pt-1">{description}</p>
      </div>
    </div>
  );
};
