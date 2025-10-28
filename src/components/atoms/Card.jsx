import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hover = true,
  ...props 
}, ref) => {
  const Component = hover ? motion.div : "div";
  
  const motionProps = hover ? {
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn("card", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;