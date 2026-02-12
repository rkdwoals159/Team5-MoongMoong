import { createElement, type ComponentType } from "react";
import DoctorIcon from "@/assets/icons/dashboard/img_doctor.svg";
import GraphDegradeIcon from "@/assets/icons/dashboard/img_graph_degrade.svg";
import GraphRisingIcon from "@/assets/icons/dashboard/img_graph_rising.svg";
import GraphStraightIcon from "@/assets/icons/dashboard/img_graph_straight.svg";

export function getLabelNoData(petName: string) {
  return {
    totalExpense: `${petName}의 총 지출을 지난달과 비교해 보여드려요`,
    medicalExpense: `${petName}의 의료비 지출을 지난달과 비교해 보여드려요`,
  };
}

export function getLabelWithData(petName: string) {
  return {
    totalExpense: `지난달에 비해 ${petName}의 총 지출이`,
    medicalExpense: `지난달에 비해 ${petName}의 의료비 지출이`,
  };
}

export function getSummaryValue(data: number | null): string {
  return data === null ? "-" : `${Math.abs(data)}% ${data < 0 ? "줄었어요" : "늘었어요"}`;
}

export type SummaryDataState = "noData" | "decrease" | "increase";

const getSummaryDataState = (data: number | null): SummaryDataState =>
  data === null ? "noData" : data < 0 ? "decrease" : "increase";

const SUMMARY_ICON_MAP: Record<
  "totalExpense" | "medicalExpense",
  Record<SummaryDataState, ComponentType>
> = {
  medicalExpense: {
    noData: DoctorIcon,
    decrease: DoctorIcon,
    increase: DoctorIcon,
  },
  totalExpense: {
    noData: GraphStraightIcon,
    decrease: GraphDegradeIcon,
    increase: GraphRisingIcon,
  },
};

export function getSummaryIcon(variant: "totalExpense" | "medicalExpense", data: number | null) {
  return createElement(SUMMARY_ICON_MAP[variant][getSummaryDataState(data)]);
}
