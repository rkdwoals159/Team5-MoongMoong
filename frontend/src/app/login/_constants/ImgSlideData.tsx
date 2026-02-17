import ImgOnboarding1 from "@/assets/images/login/onboarding1.svg";
import ImgOnboarding2 from "@/assets/images/login/onboarding2.svg";
import ImgOnboarding3 from "@/assets/images/login/onboarding3.svg";
export const slides = [
  {
    image: <ImgOnboarding1 aria-hidden className="block h-full w-full" />,
    alt: "온보딩 이미지 1",
    title: ["가족이 함께 쓰는", "우리 강아지 가계부"],
  },
  {
    image: <ImgOnboarding2 aria-hidden className="block h-full w-full" />,
    alt: "온보딩 이미지 2",
    title: ["우리 강아지 소비 흐름을", "한 눈에"],
  },
  {
    image: <ImgOnboarding3 aria-hidden className="block h-full w-full" />,
    alt: "온보딩 이미지 3",
    title: ["우리 강아지를 위한", "의료비 준비"],
  },
];
