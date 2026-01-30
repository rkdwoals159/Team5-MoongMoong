import { ProgressCardProps } from "../_types/dashboard.type";
import cn from "@/utils/style";
import GraphDegradeIcon from "@/assets/icons/dashboard/img_graph_degrade.svg";
import GraphRisingIcon from "@/assets/icons/dashboard/img_graph_rising.svg";
import GraphStraightIcon from "@/assets/icons/dashboard/img_graph_straight.svg";
import DoctorIcon from "@/assets/icons/dashboard/img_doctor.svg";

const getLabelNoData = (petName: string) => ({
  totalExpense: `${petName}의 총 지출을 지난달과 비교해 보여드려요`,
  medicalExpense: `${petName}의 의료비 지출을 지난달과 비교해 보여드려요`,
});

const getLabelWithData = (petName: string) => ({
  totalExpense: `지난달에 비해 ${petName}의 총 지출을`,
  medicalExpense: `지난달에 비해 ${petName}의 의료비 지출이`,
});

const ProgressCard = ({ variant, data, petName, className }: ProgressCardProps) => {
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
        "flex flex-col justify-center rounded-xl border border-border-light bg-white p-6",
        className ?? "",
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain">
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

export default ProgressCard;
