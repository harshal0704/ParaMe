import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 text-black shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:translate-y-[-1px]",
        ghost:
          "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]",
        icon:
          "rounded-full p-2 bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10 hover:text-white",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-8 py-3.5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
