"use client";
import { ImageProps } from "./Image.type";
import { useCallback, useState } from "react";
import NextImage from "next/image";
import cn from "@/utils/style";

const Image = ({
  src,
  alt,
  width,
  height,
  className,
  isHoverable,
  onImageChange,
  overlayText = "강아지 이미지 변경",
  ...rest
}: ImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const canInteract = isHoverable && !!onImageChange;

  const handleMouseEnter = useCallback(() => {
    if (!isHoverable) return;
    setIsHovered(true);
  }, [isHoverable]);

  const handleMouseLeave = useCallback(() => {
    if (!isHoverable) return;
    setIsHovered(false);
  }, [isHoverable]);

  return (
    <div
      className="relative inline-block"
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("block size-full rounded-[var(--radius-600)] object-cover", className ?? "")}
        {...rest}
      />
      {canInteract && isHovered && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-600)] bg-[var(--color-black-60)]">
          <button
            type="button"
            aria-label={overlayText}
            onClick={onImageChange}
            className="h-10 rounded-[var(--radius-300)] border border-[var(--color-gray-200)] bg-[var(--color-white-100)] px-[var(--spacing-400)] py-[var(--spacing-250)] text-[var(--color-gray-800)] typo-body-m-bold cursor-pointer"
          >
            {overlayText}
          </button>
        </div>
      )}
    </div>
  );
};

export default Image;
