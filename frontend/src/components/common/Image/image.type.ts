import type { ImageProps as NextImageProps } from "next/image";

/**
 * Image 컴포넌트 Props
 * Next.js Image의 모든 props + 커스텀 props
 * - src, alt는 Next.js의 required props이므로 제외해도 되지만, DX를 위해서 코드에 포함함
 * - width, height는 Next.js의 non-required props이지만, Image 컴포넌트에서는 필수 파라미터이므로 코드에 포함함
 */
export type ImageProps = Omit<NextImageProps, "width" | "height" | "src" | "alt" | "className"> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  isHoverable: boolean;
  onImageChange?: () => void;
  overlayText?: string;
};
