import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LastUpdatedBadgeProps {
  updatedAt: Date;
  tax?: boolean;
  mot?: boolean;
}

export const LastUpdatedBadge: React.FC<LastUpdatedBadgeProps> = ({
  updatedAt,
  tax,
}) => {
  const formattedDate = new Date(updatedAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [date, time] = formattedDate.split(",");

  return (
    <Popover>
      <PopoverTrigger className="absolute right-0">
        <Badge variant="outline" className="rounded-lg p-2 mr-[-1px] mt-[-1px]">
          <HelpCircle size={18} className=" flex justify-center" />
        </Badge>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-center pb-1">
          Last sync: {date} at{time}
        </p>
        <p className="text-muted-foreground text-sm pl-6 pr-5">
          {tax
            ? `If your tax status has recently changed, please allow up to `
            : `If your MOT status has recently changed, please allow up to `}
          <strong className="font-bold">24 hours</strong>
          {tax
            ? ` for this change to take effect.`
            : ` for this change to take effect.`}
        </p>
      </PopoverContent>
    </Popover>
  );
};
