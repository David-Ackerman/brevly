import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = tv({
  base: "flex items-center justify-center gap-1.5 rounded-lg disabled:opacity-50 aria-disabled:hover:cursor-not-allowed disabled:hover:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none",
  variants: {
    variant: {
      primary:
        "h-12 px-5 bg-blue-base text-white text-md not-disabled:hover:bg-blue-dark hover:cursor-not-allowed",
      secondary:
        "h-8 px2 bg-gray-20 text-gray-500 text-sm font-semibold not-disabled:hover:ring-1 not-disabled:hover:ring-blue-base",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ variant, className, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component className={buttonVariants({ variant, className })} {...props} />
  );
}
