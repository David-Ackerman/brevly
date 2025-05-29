import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center gap-6 px-12 py-8 mx-auto w-full max-w-[580px]  bg-gray-100 rounded-lg",
        className
      )}
      {...props}
    />
  );
}
