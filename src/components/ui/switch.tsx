import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
};

export function Switch({ className, checked, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-md border border-border bg-secondary transition",
        checked && "border-primary/60 bg-primary/20",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "h-4 w-4 translate-x-1 rounded-sm bg-muted-foreground transition",
          checked && "translate-x-6 bg-primary"
        )}
      />
    </button>
  );
}
