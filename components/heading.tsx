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
    <div className="flex items-center pt-2">
      {goBack && (
        <Button
          className="mr-4 flex-shrink-0 h-14"
          type="button"
          variant="outline"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground pt-1">{description}</p>
      </div>
    </div>
  );
};
