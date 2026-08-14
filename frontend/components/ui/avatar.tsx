import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      <img
        className="aspect-square h-full w-full"
        {...props}
      />
    </div>
  );
}

export { Avatar };
