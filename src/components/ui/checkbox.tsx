"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CustomCheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(({ className, indeterminate, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      data-indeterminate={indeterminate ? "" : undefined}
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        indeterminate && "bg-muted text-muted-foreground", // misal ada style khusus
        className,
      )}
      ref={ref}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current transition-none">
        {indeterminate ? (
          <div className="w-2 h-0.5 bg-current rounded-sm" /> // garis horizontal
        ) : (
          <CheckIcon className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
