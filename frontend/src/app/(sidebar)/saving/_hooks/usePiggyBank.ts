import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Engine as EngineType,
  Render as RenderType,
  Runner as RunnerType,
  Mouse as MouseType,
  Body,
} from "matter-js";
import { PIGGY_BANK } from "@/app/(sidebar)/saving/_constants";
import type { ToolTipState } from "@/app/(sidebar)/saving/_types";
import {
  createWalls,
  createCoinBody,
  renderLabels,
  findTooltipTarget,
} from "@/app/(sidebar)/saving/_utils";

export default function usePiggyBank() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<EngineType | null>(null);
  const renderRef = useRef<RenderType | null>(null);
  const runnerRef = useRef<RunnerType | null>(null);
  const mouseRef = useRef<MouseType | null>(null);
  const matterRef = useRef<typeof import("matter-js") | null>(null);
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

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const Matter = await import("matter-js");
      if (cancelled) return;
      matterRef.current = Matter;
      const { Engine, Render, Runner, Composite, Events, Mouse, MouseConstraint } = Matter;

      if (!sceneRef.current) return;

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
        const dpr = window.devicePixelRatio || 1;
        Render.setPixelRatio(renderRef.current, dpr);

        if (mouseRef.current) {
          mouseRef.current.pixelRatio = dpr;
        }

        if (wallsRef.current.length) {
          Composite.remove(engineRef.current.world, wallsRef.current);
        }
        wallsRef.current = createWalls(Matter.Bodies, width, height);
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

      /** MouseConstraint 설정 (드래그 인터랙션) */
      const mouse = Mouse.create(render.canvas);
      mouseRef.current = mouse;
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: PIGGY_BANK.DRAG_STIFFNESS,
          render: { visible: false },
        },
      });
      Composite.add(engine.world, mouseConstraint);
      render.mouse = mouse;
      render.canvas.style.touchAction = "none";

      /** 마우스 이벤트 핸들러 */
      let isDragging = false;

      Events.on(mouseConstraint, "startdrag", () => {
        isDragging = true;
        setToolTip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      });

      Events.on(mouseConstraint, "enddrag", () => {
        isDragging = false;
      });

      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) return;
        const result = findTooltipTarget(Matter.Query, engine, render.canvas, e);
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

      const textureImg = new Image();
      textureImg.src = PIGGY_BANK.COIN_TEXTURE_PATH;
      textureImg.onload = () => setReady(true);
      textureImg.onerror = () => setReady(true);

      cleanup = () => {
        textureImg.onload = null;
        textureImg.onerror = null;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        resizeObserver.disconnect();
        Events.off(mouseConstraint, "startdrag");
        Events.off(mouseConstraint, "enddrag");
        Composite.remove(engine.world, mouseConstraint);
        render.canvas.removeEventListener("mousemove", handleMouseMove);
        render.canvas.removeEventListener("mouseleave", handleMouseLeave);
        Events.off(render, "afterRender", handleAfterRender);
        Render.stop(render);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        render.canvas.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const handleDrop = useCallback(
    (name: string, amount: number, createdAt: string, targetAmount: number) => {
      if (!matterRef.current || !engineRef.current) return;
      const { Composite, Bodies } = matterRef.current;
      const ball = createCoinBody(Bodies, name, amount, createdAt, targetAmount, sizeRef.current);
      Composite.add(engineRef.current.world, ball);
    },
    [],
  );

  const clearCoins = useCallback(() => {
    if (!matterRef.current || !engineRef.current) return;
    const { Composite } = matterRef.current;
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
}
