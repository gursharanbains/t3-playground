"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import clsx from "clsx";
import { LabelProps } from "@radix-ui/react-label";

const Label = ({ className, ...props }: LabelProps) => (
  <LabelPrimitive.Root
    className={clsx(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
);

export default Label;
