
import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
  children?: React.ReactNode;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  endValue, 
  duration = 1500, 
  className = "", 
  formatter = (value) => value.toString(),
  children
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Start animation when component comes into view
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      
      // Don't animate if the value is 0
      if (endValue === 0) {
        setCount(0);
        return;
      }
      
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Use easeOutExpo for a nice deceleration effect
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const currentCount = Math.floor(easeOutExpo * endValue);
        
        setCount(currentCount);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endValue);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [inView, endValue, duration, hasAnimated]);
  
  return (
    <div ref={ref} className={className}>
      <span>{formatter(count)}</span>
      {children}
    </div>
  );
};

export default AnimatedCounter;
