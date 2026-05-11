import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> & {
  value: number;
  onValueChange: (value: number) => void;
};

export function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onValueChange(Number(event.target.value))}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-md bg-secondary accent-primary outline-none",
        className
      )}
      {...props}
    />
  );
}
