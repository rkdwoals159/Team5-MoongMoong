"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DrawerProps } from "./drawer.type";
import { cn } from "@/utils/style";

const Drawer = ({
  href,
  urlMatch,
  className,
  children,
  fullWidth = false,
  startIcon,
  startIconSelected,
  ...rest
}: DrawerProps) => {
  const pathname = usePathname();
  const hrefPath =
    typeof href === "string" ? href : ((href as { pathname?: string })?.pathname ?? "");
  const autoMatch = hrefPath
    ? hrefPath === "/"
      ? pathname === "/"
      : pathname.startsWith(hrefPath)
    : false;
  const isSelected = urlMatch ?? autoMatch;
  const variantKey = isSelected ? "SELECTED" : "UNSELECTED";
  const iconToRender = isSelected && startIconSelected ? startIconSelected : startIcon;

  return (
    <Link
      {...rest}
      href={href}
      className={cn(baseClasses, variantClasses[variantKey], className ?? "")}
      data-variant={variantKey}
      data-full-width={fullWidth ? "true" : "false"}
    >
      <span className="inline-flex items-center gap-[inherit]">
        {iconToRender && (
          <span className="inline-flex items-center justify-center w-6 h-6">{iconToRender}</span>
        )}
        {children}
      </span>
    </Link>
  );
};

export default Drawer;

//--------------------------------
// Tailwind CSS classes

const baseClasses =
  "inline-flex items-center justify-start border transition-colors duration-200 ease-out select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue-500)] data-[full-width=true]:w-full cursor-pointer text-left px-[var(--spacing-400)] py-[var(--spacing-300)] rounded-[var(--radius-400)] gap-[var(--spacing-500)]";

const variantClasses: Record<"SELECTED" | "UNSELECTED", string> = {
  SELECTED: "bg-[var(--color-gray-80)]  border-transparent typo-body-l-bold",
  UNSELECTED: "bg-transparent border-transparent typo-body-l-medium  hover:font-bold",
};
//--------------------------------
