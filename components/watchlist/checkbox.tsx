import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function WatchlistCheckbox({
  checked,
  onChange,
  size = 18,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center border transition-colors",
        checked
          ? "border-marquee bg-marquee"
          : "border-white/20 bg-black/35 hover:border-white/45",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {checked && <Check size={size - 6} className="text-white" />}
    </button>
  );
}
