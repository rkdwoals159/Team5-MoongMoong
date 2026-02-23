import type { DogBreed } from "@/types/common";

export type { DogBreedCode } from "@/types/common";

/**
 * 반려견 견종 매핑 테이블
 * - code: API 연동 시 사용하는 영문 코드
 * - koName: 화면에 표시되는 한글 이름
 * - enName: 참고용 영문 이름
 */
export const DOG_BREEDS: DogBreed[] = [
  { code: "GRE", koName: "그레이트피레니즈", enName: "Great Pyrenees" },
  { code: "DAL", koName: "달마시안", enName: "Dalmatian" },
  { code: "DAS", koName: "닥스훈트", enName: "Dachshund" },
  { code: "DOB", koName: "도베르만 핀셔", enName: "Doberman Pinscher" },
  { code: "GOL", koName: "골든리트리버", enName: "Golden Retriever" },
  { code: "LAB", koName: "래브라도 리트리버", enName: "Labrador Retriever" },
  { code: "MAL", koName: "말라뮤트", enName: "Alaskan Malamute" },
  { code: "BUL", koName: "불독", enName: "Bulldog" },
  { code: "BEA", koName: "비글", enName: "Beagle" },
  { code: "BIC", koName: "비숑프리제", enName: "Bichon Frise" },
  { code: "SHE", koName: "쉽독", enName: "Sheepdog" },
  { code: "SCH", koName: "슈나우저", enName: "Schnauzer" },
  { code: "MIL", koName: "믹스 장모", enName: "Mixed (Long hair)" },
  { code: "MIS", koName: "믹스 단모", enName: "Mixed (Short hair)" },
  { code: "HUS", koName: "허스키", enName: "Husky" },
  { code: "HOU", koName: "하운드", enName: "Hound" },
  { code: "GER", koName: "저먼셰퍼드", enName: "German Shepherd" },
  { code: "JIN", koName: "진도", enName: "Jindo" },
  { code: "CHS", koName: "치와와 단모", enName: "Chihuahua (Short)" },
  { code: "CHL", koName: "치와와 장모", enName: "Chihuahua (Long)" },
  { code: "COC", koName: "코커스패니엘", enName: "Cocker Spaniel" },
  { code: "TER", koName: "테리어", enName: "Terrier" },
  { code: "POM", koName: "포메라니안", enName: "Pomeranian" },
  { code: "POO", koName: "푸들", enName: "Poodle" },
  { code: "SHI", koName: "시추", enName: "Shih Tzu" },
  { code: "WEL", koName: "웰시코기", enName: "Welsh Corgi" },
  { code: "ETC", koName: "기타", enName: "Others" },
];

/**
 * Dropdown 등에서 사용할 한글 견종 옵션 리스트
 */
export const DOG_BREED_LABELS = DOG_BREEDS.map((breed) => breed.koName);
