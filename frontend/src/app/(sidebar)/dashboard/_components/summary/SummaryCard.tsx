import type { SummaryCardProps } from "@/app/(sidebar)/dashboard/_types";
import {
  getLabelNoData,
  getLabelWithData,
  getSummaryValue,
  getSummaryIcon,
} from "@/app/(sidebar)/dashboard/_constants";
import { cn } from "@/utils/style";
import SummaryCardWrapper from "./SummaryCardWrapper";

const SummaryCard = ({ variant, data, petName, className }: SummaryCardProps) => {
  const hasData = data !== null;
  const labelText = hasData
    ? getLabelWithData(petName ?? "")[variant]
    : getLabelNoData(petName ?? "")[variant];
  const value = getSummaryValue(data);
  const iconElement = getSummaryIcon(variant, data);

  return (
    <SummaryCardWrapper className={className}>
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-500 bg-blue-100 [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain",
        )}
      >
        {iconElement}
      </div>
      <div className="flex flex-col gap-1">
        <p className="typo-body-l-bold text-gray-500">{labelText}</p>
        <p className="typo-headline-m-bold text-text-base">{value}</p>
      </div>
    </SummaryCardWrapper>
  );
};

export default SummaryCard;
