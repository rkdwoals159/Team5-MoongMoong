import { Metadata } from "next";

export const metadata: Metadata = {
  title: "저금통",
  description: "저금통",
};

const SavingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <link rel="preload" href="/images/img_coin_texture.png" as="image" />
      <div className="flex flex-col gap-850 px-850 text-neutral-900 max-w-full h-full overflow-hidden pb-1200">
        <div className="py-300 text-neutral-900">
          <h1 className="typo-headline-s-bold">저금통</h1>
        </div>
        {children}
      </div>
    </>
  );
};

export default SavingLayout;
