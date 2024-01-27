import { ChevronDown } from "lucide-react";

interface ChevronProps {
  open: boolean;
  className?: string;
}

const Chevron: React.FC<ChevronProps> = ({ open, className }) => (
  <ChevronDown
    className={`ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 ${className} ${
      open && "transform rotate-180"
    }`}
    aria-hidden="true"
  />
);

export default Chevron;
