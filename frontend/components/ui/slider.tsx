import * as React from "react";
import { cn } from "@/lib/utils";

function Slider({
  className,
  value,
  onValueChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  value?: number[];
  onValueChange?: (value: number[]) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [Number(e.target.value)];
    onValueChange?.(newValue);
  };

  return (
    <input
      type="range"
      value={value?.[0] ?? props.defaultValue}
      onChange={handleChange}
      className={cn(
        "w-full accent-amber-400 h-1.5 bg-stone-800 rounded-full appearance-none cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export { Slider };
