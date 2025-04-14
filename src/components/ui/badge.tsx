
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Coins, Badge as BadgeIcon } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gold: "border-icc-gold/50 bg-icc-gold/20 text-icc-blue hover:bg-icc-gold/40",
        coin: "bg-icc-gold/20 text-icc-blue border-icc-gold/30 flex items-center gap-1 hover:bg-icc-gold/40",
        tier: "bg-icc-blue/20 text-icc-gold border-icc-blue/30 flex items-center gap-1 hover:bg-icc-blue/40"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(badgeVariants({ variant }), className)} 
        {...props}
      >
        {variant === 'coin' && <Coins className="h-3 w-3 mr-1" />}
        {variant === 'tier' && <BadgeIcon className="h-3 w-3 mr-1" />}
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }
