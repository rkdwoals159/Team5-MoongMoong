import { describe, it, expect } from "vitest";
import { cn } from "@/utils/style";

describe("style utils", () => {
  describe("cn 함수", () => {
    describe("기본 동작", () => {
      it("단일 클래스명 반환", () => {
        expect(cn("button")).toBe("button");
      });

      it("여러 클래스명을 공백으로 연결", () => {
        expect(cn("button", "primary", "large")).toBe("button primary large");
      });

      it("빈 문자열을 제외하고 연결", () => {
        expect(cn("button", "", "primary")).toBe("button primary");
      });

      it("falsy 값을 제외하고 연결", () => {
        expect(cn("button", null, "primary", undefined, "large")).toBe("button primary large");
      });
    });

    describe("엣지 케이스", () => {
      it("빈 배열인 경우 빈 문자열 반환", () => {
        expect(cn()).toBe("");
      });

      it("모든 값이 빈 문자열인 경우 빈 문자열 반환", () => {
        expect(cn("", "", "")).toBe("");
      });

      it("모든 값이 falsy인 경우 빈 문자열 반환", () => {
        expect(cn(null, undefined, "")).toBe("");
      });

      it("false는 falsy이므로 제외됨", () => {
        expect(cn("button", false, "primary")).toBe("button primary");
      });
    });

    describe("조건부 클래스명", () => {
      it("조건에 따라 클래스명 추가", () => {
        const isActive = true;
        const isDisabled = false;

        expect(cn("button", isActive && "active", isDisabled && "disabled")).toBe("button active");
      });

      it("여러 조건부 클래스명 처리", () => {
        const size = "large";
        const variant = "primary";

        expect(
          cn("button", size === "large" && "btn-large", variant === "primary" && "btn-primary"),
        ).toBe("button btn-large btn-primary");
      });
    });

    describe("실제 사용 시나리오", () => {
      it("버튼 컴포넌트 클래스명 조합", () => {
        const baseClass = "btn";
        const variantClass = "btn-primary";
        const sizeClass = "btn-lg";

        expect(cn(baseClass, variantClass, sizeClass)).toBe("btn btn-primary btn-lg");
      });

      it("상태에 따른 클래스명 조합", () => {
        const isLoading = true;
        const isDisabled = false;
        const isActive = true;

        expect(
          cn("button", isLoading && "loading", isDisabled && "disabled", isActive && "active"),
        ).toBe("button loading active");
      });

      it("반응형 클래스명 조합", () => {
        expect(cn("text-base", "md:text-lg", "lg:text-xl")).toBe("text-base md:text-lg lg:text-xl");
      });

      it("복잡한 조건부 스타일링", () => {
        const theme = "dark";
        const size = "medium";
        const hasError = false;

        expect(
          cn(
            "input",
            theme === "dark" && "input-dark",
            size === "medium" && "input-md",
            hasError && "input-error",
          ),
        ).toBe("input input-dark input-md");
      });
    });

    describe("공백 처리", () => {
      it("앞뒤 공백이 있는 클래스명 처리", () => {
        expect(cn("  button  ", "  primary  ")).toBe("button primary");
      });

      it("중간에 공백이 있는 클래스명은 그대로 유지", () => {
        expect(cn("flex justify-center", "items-center")).toBe("flex justify-center items-center");
      });
    });
  });
});
