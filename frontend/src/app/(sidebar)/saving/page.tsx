import SavingClient from "./_components/SavingClient";
import { SAVING_INFO_MOCK, SAVING_CONTENT_MOCK } from "./savingMock"; // TODO: API 호출 후 삭제

// TODO: mock 데이터 API 호출 후 삭제
const SavingPage = () => {
  return (
    <>
      <div className="py-300 text-neutral-900">
        <h1 className="typo-headline-s-bold">저금통</h1>
      </div>

      <main className="flex gap-700 flex-1 min-h-0">
        <SavingClient
          target={SAVING_INFO_MOCK.target}
          total={SAVING_INFO_MOCK.total}
          rankings={SAVING_INFO_MOCK.rankings}
          coins={SAVING_CONTENT_MOCK.coins}
        />
      </main>
    </>
  );
};

export default SavingPage;
