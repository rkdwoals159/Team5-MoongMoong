import { useSavingStatus } from "@/app/(sidebar)/saving/_hooks/useSavingStatus";

export default function SavingRanking() {
  const { status } = useSavingStatus();
  return (
    <>
      <h2 className="typo-title-l-bold">우리 가족 저금 랭킹</h2>
      <p className="typo-body-l-medium text-gray-500">누가 {status.petName}를 가장 사랑할까?</p>
      <div className="flex flex-col gap-300 mt-700 overflow-y-auto flex-1 min-h-0">
        {status.rankings.map((ranking, index) => (
          <div key={ranking.userName} className="flex gap-500 mt-500">
            <div className="w-1/7 flex justify-center bg-gray-80 h-1/2 items-center rounded-250">
              <span className=" px-full typo-body-l-bold text-gray-800">{index + 1}위</span>
            </div>
            <div className="flex flex-col gap-100 py-550 px-800 border border-gray-100 rounded-300 flex-1">
              <div className="typo-title-s-bold text-gray-800">{ranking.userName}</div>
              <div className="typo-body-m-bold text-gray-500">
                {ranking.total?.toLocaleString() ?? 0}원 저금
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
