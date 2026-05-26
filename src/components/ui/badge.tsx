import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[#10B981] text-white": variant === "default",
          "border-transparent bg-[#0A3200] text-[#7cdc70]": variant === "secondary",
          "border-transparent bg-[#FF4D4D] text-white": variant === "destructive",
          "border-[#899483]/30 text-[#bfcab8]": variant === "outline",
          "border-transparent bg-[#7CFFCB]/20 text-[#7CFFCB] border border-[#7CFFCB]/30":
            variant === "success",
          "border-transparent bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30":
            variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeProps as UIProps }
