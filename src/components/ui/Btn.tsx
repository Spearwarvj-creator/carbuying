"use client";

import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { ArrowIcon } from "./icons";

type Variant = "primary" | "ghost" | "quiet";

/**
 * The one button. It presses in on tap (a short scale, the feedback people expect from a native
 * button) and the primary one nudges its arrow on hover. Disabled-looking buttons keep
 * aria-disabled instead of the disabled attribute, so they can still explain themselves on click.
 */
export function Btn({
  variant = "ghost",
  arrow,
  icon,
  children,
  className,
  ...rest
}: Omit<ComponentProps<typeof motion.button>, "children"> & {
  variant?: Variant;
  arrow?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={`bt bt-${variant}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {icon && <span className="bt-ico">{icon}</span>}
      <span className="bt-text">{children}</span>
      {arrow && (
        <span className="bt-arrow">
          <ArrowIcon size={20} />
        </span>
      )}
    </motion.button>
  );
}
