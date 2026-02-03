import { SummaryCardProps } from "@/app/(sidebar)/dashboard/_types";
import { getLabelNoData, getLabelWithData } from "@/app/(sidebar)/dashboard/_constants";
import GraphDegradeIcon from "@/assets/icons/dashboard/img_graph_degrade.svg";
import GraphRisingIcon from "@/assets/icons/dashboard/img_graph_rising.svg";
import GraphStraightIcon from "@/assets/icons/dashboard/img_graph_straight.svg";
import DoctorIcon from "@/assets/icons/dashboard/img_doctor.svg";
import cn from "@/utils/style";

const SummaryCard = ({ variant, data, petName, className }: SummaryCardProps) => {
  const hasData = data !== null;
  const labelText = hasData
    ? getLabelWithData(petName ?? "")[variant]
    : getLabelNoData(petName ?? "")[variant];
  const value = hasData ? `${data.forecast}% ${data.isMinus ? "줄였어요" : "늘었어요"}` : "-";
  const icon =
    variant === "medicalExpense" ? (
      <DoctorIcon />
    ) : hasData ? (
      data.isMinus ? (
        <GraphDegradeIcon />
      ) : (
        <GraphRisingIcon />
      )
    ) : (
      <GraphStraightIcon />
    );

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col justify-center rounded-600 border border-border-light bg-white p-600",
        className ?? "",
      )}
    >
      <div className="flex flex-col gap-500">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-500 bg-blue-100 [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain",
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <p className="typo-body-l-bold text-gray-500">{labelText}</p>
          <p className="typo-headline-m-bold text-text-base">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
