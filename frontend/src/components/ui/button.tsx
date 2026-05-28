import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-green)] text-[var(--color-bg)] hover:bg-[var(--color-green-strong)]",
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-fg)] hover:border-[var(--color-green)] hover:text-[var(--color-green)]",
        subtle:
          "bg-[var(--color-panel)] text-[var(--color-fg)] hover:bg-[var(--color-panel-2)]",
        ghost:
          "text-[var(--color-fg)] hover:bg-[var(--color-panel)]",
        link:
          "text-[var(--color-green)] underline-offset-4 hover:underline",
        danger:
          "bg-transparent border border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-red-500 hover:text-red-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
