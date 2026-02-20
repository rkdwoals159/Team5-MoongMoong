"use client";

import Loading from "@/components/common/Loading/Loading";
import { LOADING_VIEW_TITLE, LOADING_VIEW_DESCRIPTION } from "@/app/(sidebar)/dashboard/_constants";

export default function PetImageLoadingView() {
  return (
    <>
      <h2 className="text-center typo-headline-s-bold text-gray-800">{LOADING_VIEW_TITLE}</h2>
      <p className="mt-200 text-center mb-1000 typo-title-s-medium text-gray-600">
        {LOADING_VIEW_DESCRIPTION}
      </p>
      <div className="flex min-h-[200px] items-center justify-center">
        <Loading count={3} height={64} />
      </div>
    </>
  );
}
