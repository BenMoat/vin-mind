import { HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type LastUpdatedBadgeProps = {
  updatedAt: Date;
} & (
  | { tax: boolean; mot?: never; insurance?: never }
  | { tax?: never; mot: boolean; insurance?: never }
  | { tax?: never; mot?: never; insurance: boolean }
);

export const LastUpdatedBadge: React.FC<LastUpdatedBadgeProps> = ({
  updatedAt,
  tax,
  mot,
  insurance,
}) => {
  const formattedDate = new Date(updatedAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [date, time] = formattedDate.split(",");

  const getStatusText = () => {
    if (tax) return "tax";
    if (mot) return "MOT";
    if (insurance) return "insurance";
  };

  return (
    <Popover>
      <PopoverTrigger className="absolute right-0">
        <Badge
          variant="outline"
          className="rounded-lg p-2 mr-[-1px] mt-[-1px] hover:bg-accent"
          aria-label="Information"
        >
          <HelpCircle size={18} className="flex justify-center" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <p className="pb-1">
          Last sync: {date} at{time}
        </p>
        <p className="text-muted-foreground text-sm">
          {`If your ${getStatusText()} status has recently changed, please allow `}
          <b className="text-bold">24 hours</b>
          {` for this to take effect.`}
        </p>
      </PopoverContent>
    </Popover>
  );
};
