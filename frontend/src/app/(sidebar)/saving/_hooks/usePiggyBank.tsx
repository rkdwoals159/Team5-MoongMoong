import { useCallback, useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Composite, Events } from "matter-js";
import type { Body } from "matter-js";
import { PIGGY_BANK } from "@/app/(sidebar)/saving/_constants";
import type { ToolTipState } from "@/app/(sidebar)/saving/_types";
import {
  createWalls,
  createCoinBody,
  renderLabels,
  findTooltipTarget,
} from "@/app/(sidebar)/saving/_utils";

const usePiggyBank = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const wallsRef = useRef<Body[]>([]);
  const [ready, setReady] = useState(false);
  const [toolTip, setToolTip] = useState<ToolTipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    if (!sceneRef.current) return;

    let cleanup = () => {};

    /** 엔진 생성 */
    const engine = Engine.create();
    engine.gravity.y = PIGGY_BANK.GRAVITY;
    engineRef.current = engine;

    /** 렌더러 생성 */
    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: sceneRef.current.clientWidth || PIGGY_BANK.DEFAULT_WIDTH,
        height: sceneRef.current.clientHeight || PIGGY_BANK.DEFAULT_HEIGHT,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;
    Render.run(render);

    /** 러너 생성 */
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    /** 화면 크기 동기화 */
    const syncSize = () => {
      if (!sceneRef.current || !engineRef.current || !renderRef.current) return;

      const width = sceneRef.current.clientWidth || PIGGY_BANK.DEFAULT_WIDTH;
      const height = sceneRef.current.clientHeight || PIGGY_BANK.DEFAULT_HEIGHT;
      sizeRef.current = { width, height };

      renderRef.current.canvas.width = width;
      renderRef.current.canvas.height = height;
      renderRef.current.options.width = width;
      renderRef.current.options.height = height;
      Render.setPixelRatio(renderRef.current, window.devicePixelRatio || 1);

      if (wallsRef.current.length) {
        Composite.remove(engineRef.current.world, wallsRef.current);
      }
      wallsRef.current = createWalls(width, height);
      Composite.add(engineRef.current.world, wallsRef.current);
    };

    syncSize();

    let rafId: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(syncSize);
    });
    resizeObserver.observe(sceneRef.current);

    /** 마우스 이벤트 핸들러 */
    const handleMouseMove = (e: MouseEvent) => {
      const result = findTooltipTarget(engine, render.canvas, e);
      if (!result) {
        setToolTip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }
      setToolTip(result);
    };

    const handleMouseLeave = () => {
      setToolTip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    /** 라벨 렌더링 콜백 */
    const handleAfterRender = () => {
      if (!renderRef.current || !engineRef.current) return;
      const ctx = renderRef.current.context;
      const bodies = Composite.allBodies(engineRef.current.world);
      renderLabels(ctx, bodies);
    };

    render.canvas.addEventListener("mousemove", handleMouseMove);
    render.canvas.addEventListener("mouseleave", handleMouseLeave);
    Events.on(render, "afterRender", handleAfterRender);

    queueMicrotask(() => setReady(true));

    cleanup = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      render.canvas.removeEventListener("mousemove", handleMouseMove);
      render.canvas.removeEventListener("mouseleave", handleMouseLeave);
      Events.off(render, "afterRender", handleAfterRender);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };

    return () => {
      cleanup();
    };
  }, []);

  const handleDrop = useCallback(
    (name: string, amount: number, createdAt: string, targetAmount: number) => {
      if (!engineRef.current) return;
      const ball = createCoinBody(name, amount, createdAt, targetAmount, sizeRef.current);
      Composite.add(engineRef.current.world, ball);
    },
    [],
  );

  const clearCoins = useCallback(() => {
    if (!engineRef.current) return;
    const bodies = Composite.allBodies(engineRef.current.world);
    const coins = bodies.filter((body) => !wallsRef.current.includes(body));
    Composite.remove(engineRef.current.world, coins);
  }, []);

  return {
    ready,
    toolTip,
    sceneRef,
    handleDrop,
    clearCoins,
  };
};

export default usePiggyBank;
