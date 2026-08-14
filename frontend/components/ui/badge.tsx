import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-500/10 text-amber-300",
        secondary:
          "border-transparent bg-white/5 text-stone-300",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-300",
        destructive:
          "border-transparent bg-red-500/10 text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
