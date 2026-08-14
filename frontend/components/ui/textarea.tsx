import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-xl border border-white/10 bg-[#14120e] px-4 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 focus-visible:border-amber-500/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
