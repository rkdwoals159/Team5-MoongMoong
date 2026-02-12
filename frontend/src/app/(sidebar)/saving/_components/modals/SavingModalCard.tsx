import { SavingModalCardProps } from "@/app/(sidebar)/saving/_types";

const SavingModalCard = ({ title, description, children }: SavingModalCardProps) => {
  return (
    <div className="w-[380px] rounded-600 border border-gray-100 bg-white-100 shadow-[0px_4px_20px_0px_rgba(26,31,39,0.12)] px-700 pt-700 pb-700 flex flex-col">
      <h3 className="typo-title-m-bold text-gray-800">{title}</h3>
      <p className="mt-200 typo-body-m-medium text-gray-400">{description}</p>
      {children}
    </div>
  );
};

export default SavingModalCard;
