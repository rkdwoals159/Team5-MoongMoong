import type { ButtonHTMLAttributes, ReactElement, SVGProps } from "react";

export type PaginationDirection = "left" | "right";

export type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: PaginationDirection;
  isDisabled?: boolean;
};

export type SvgComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;
