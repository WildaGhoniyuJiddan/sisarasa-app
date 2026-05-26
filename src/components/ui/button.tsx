import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "brand"
    | "dark"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          // Variants
          {
            "bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-emerald-500/10":
              variant === "default",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
            "border border-[#899483]/30 bg-transparent text-[#bfcab8] hover:bg-[#163d07]/20 hover:text-white":
              variant === "outline",
            "bg-[#0A3200] text-[#7cdc70] hover:bg-[#163d07]":
              variant === "secondary",
            "hover:bg-[#163d07]/20 hover:text-[#7cdc70] text-[#bfcab8]":
              variant === "ghost",
            "text-[#7cdc70] underline-offset-4 hover:underline":
              variant === "link",
            // SisaRasa Special Brand
            "bg-[#7cdc70] text-[#031800] hover:bg-[#8eeb82] hover:shadow-lg hover:shadow-[#7cdc70]/20 font-black":
              variant === "brand",
            // Dark / Navy for AI feel
            "bg-[#062600] text-[#7cdc70] border border-[#7cdc70]/30 shadow-lg hover:bg-[#0A3200] hover:border-[#7cdc70]/60 hover:shadow-[#7cdc70]/10":
              variant === "dark",
          },
          // Sizes
          {
            "h-11 px-6 py-2": size === "default",
            "h-9 rounded-full px-3 text-xs": size === "sm",
            "h-12 rounded-full px-8 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
