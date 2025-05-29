import { WarningIcon } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = ComponentProps<"input"> & {
  label: string;
  fixedValue?: string;
  errorMessage?: string;
};

export const Input = ({
  className,
  label,
  errorMessage,
  fixedValue = "",
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
      <div className="border flex items-center border-gray-300 rounded-md focus-within:border-[1.5px] group-data-[error=true]:border-[1.5px] focus-within:not-group-data-[error=true]:border-blue-base group-data-[error=true]:border-feedback-danger overflow-hidden">
        {fixedValue && (
          <span className="text-gray-600 text-md font-normal pl-4 -mb-0.5">
            {fixedValue}
          </span>
        )}

        <input
          className={twMerge(
            "h-12 flex-1 first:pl-4 text-gray-600 text-md font-normal outline-none pr-4",
            className
          )}
          id={label}
          {...props}
        />
      </div>
      {errorMessage && (
        <span className="text-sm text-gray-500">
          <WarningIcon size={16} className="text-feedback-danger" />{" "}
          {errorMessage}
        </span>
      )}
    </div>
  );
};
