import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = tv({
  base: "flex items-center justify-center gap-1.5 disabled:opacity-50 aria-disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none not-disabled:cursor-pointer transition-colors transition-shadow",
  variants: {
    variant: {
      primary:
        "w-full h-12 rounded-lg px-5 bg-blue-base text-white text-md not-disabled:hover:bg-blue-dark",
      secondary:
        "h-8 rounded-sm px-2 bg-gray-200 text-gray-500 text-sm font-semibold not-disabled:hover:ring-1 not-disabled:hover:ring-blue-base",
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
