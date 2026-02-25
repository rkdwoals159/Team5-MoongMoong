"use client";

import { useId, useState } from "react";
import InfoIcon from "@/assets/icons/forecast/ic_info.svg";
import type { InfoTooltipProps } from "./infoTooltip.type";
const InfoTooltip = ({ description, iconSize = 20 }: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="도움말"
        className="p-0 border-none bg-transparent cursor-pointer flex items-center"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <InfoIcon width={iconSize} height={iconSize} />
      </button>
      {isOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute left-3 bottom-full mb-200 p-400 rounded-300 bg-white-100 border border-gray-100 shadow-lg z-50"
        >
          <p className="typo-caption-m-medium text-neutral-700 whitespace-nowrap">{description}</p>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
