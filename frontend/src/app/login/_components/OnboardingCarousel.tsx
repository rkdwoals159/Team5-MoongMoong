"use client";

import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { slides } from "@/app/login/_constants/ImgSlideData";
import { ONBOARDING_CAROUSEL_INTERVAL } from "@/app/login/_constants";
export default function OnboardingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  // 슬라이드 인디케이터 클릭 시 해당 슬라이드로 이동
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // 4초마다 자동으로 다음 슬라이드로 이동
  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, ONBOARDING_CAROUSEL_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, [emblaApi]);

  const indicators = useMemo(
    () =>
      slides.map((_, index) => (
        <button
          key={`indicator-${index}`}
          type="button"
          aria-label={`온보딩 ${index + 1}번째 보기`}
          onClick={() => emblaApi?.scrollTo(index)}
          className={`size-[10px] rounded-full transition-opacity ${
            index === activeIndex ? "bg-white-100" : "bg-white-100 opacity-40"
          }`}
        />
      )),
    [activeIndex, emblaApi],
  );

  return (
    <div className="relative mx-auto h-[800px] w-full max-w-[700px] overflow-hidden rounded-[20px]">
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.alt}
              className="relative flex-[0_0_100%] before:pointer-events-none before:absolute before:inset-y-0 before:-left-px before:w-[2px] before:bg-[#EFC649] after:pointer-events-none after:absolute after:inset-y-0 after:-right-px after:w-[2px] after:bg-[#EFC649]"
            >
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="absolute inset-0"
                aria-label={`온보딩 ${index + 1} 이미지 클릭`}
              >
                {slide.image}
                <p className="pointer-events-none absolute bottom-[82px] left-0 right-0 text-center typo-headline-l-bold text-text-base">
                  {slide.title[0]}
                  <br />
                  {slide.title[1]}
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-[32px] left-0 right-0 flex justify-center">
        <div className="flex items-center gap-500" aria-label="페이지 인디케이터">
          {indicators}
        </div>
      </div>
    </div>
  );
}
