import ToastProvider from "@/components/ui/Toast/ToastProvider";
import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, ReactNode } from "react";

// 전역 프로바이더를 위한 래퍼 (필요시 Toast, Theme 프로바이더를 여기에 추가)
interface AllProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

interface CustomRenderResult extends ReturnType<typeof render> {
  user: ReturnType<typeof userEvent.setup>;
}

function customRender(ui: ReactElement, options?: CustomRenderOptions): CustomRenderResult {
  const { wrapper, ...renderOptions } = options ?? {};
  const Wrapper = wrapper ?? AllProviders;

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    user: userEvent.setup(),
  };
}

// React Testing Library에서 모든 것을 재내보내기
export * from "@testing-library/react";
export { customRender as render };
