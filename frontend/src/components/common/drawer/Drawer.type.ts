import type { LinkProps } from "next/link";

export type DrawerOwnProps = {
  href: LinkProps["href"];
  urlMatch?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  startIconSelected?: React.ReactNode;
  className?: string;
};

export type DrawerProps = DrawerOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof DrawerOwnProps> &
  Omit<LinkProps, "href">;
