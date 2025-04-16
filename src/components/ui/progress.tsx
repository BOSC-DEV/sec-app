
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  max?: number
  animated?: boolean
  delay?: number
  color?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, max = 100, animated = false, delay = 0, color, ...props }, ref) => {
  const [animatedValue, setAnimatedValue] = React.useState(0);
  
  React.useEffect(() => {
    if (!animated) {
      setAnimatedValue(value);
      return;
    }
    
    // Reset animation value when value changes to 0
    if (value === 0) {
      setAnimatedValue(0);
      return;
    }
    
    // Delay the start of the animation based on the delay prop
    const timeoutId = setTimeout(() => {
      // Animate from 0 to the target value
      let startTime: number;
      let animationFrameId: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Duration of 1 second (adjust as needed)
        const duration = 1200;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic function for smoother animation
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = eased * value;
        
        setAnimatedValue(currentValue);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [value, animated, delay]);
  
  // Calculate the percentage for the transform
  const percentComplete = max > 0 ? 100 - (animatedValue / max) * 100 : 0;
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-none",
          color || "bg-primary" 
        )}
        style={{ transform: `translateX(-${percentComplete}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
