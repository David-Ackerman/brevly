import { WarningIcon } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = ComponentProps<"input"> & {
  label: string;
  errorMessage?: string;
};

export const Input = ({
  className,
  label,
  errorMessage,
  ...props
}: InputProps) => {
  return (
    <div data-error={!!errorMessage} className="group flex flex-col gap-2">
      <label
        className="block text-gray-700 text-xs uppercase group-focus-within:text-blue-base group-focus-within:font-bold group-data-[error=true]:text-feedback-danger group-data-[error=true]:font-bold"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        className={twMerge(
          "h-12 px-4 border border-gray-300 text-gray-600 text-md font-normal outline-none rounded-md focus:border-[1.5px] group-data-[error=true]:border-[1.5px] focus:border-blue-base group-data-[error=true]:border-feedback-danger",
          className
        )}
        id={label}
        {...props}
      />
      {errorMessage && (
        <span className="text-sm text-gray-500">
          <WarningIcon size={16} className="text-feedback-danger" />{" "}
          {errorMessage}
        </span>
      )}
    </div>
  );
};
