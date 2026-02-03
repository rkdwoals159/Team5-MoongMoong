import { Bodies, Query, type Engine } from "matter-js";
import type { Body } from "matter-js";
import { PIGGY_BANK } from "@/app/(sidebar)/saving/_constants";
import type { BallBody, ToolTipState } from "@/app/(sidebar)/saving/_types";
import { formatAmount } from "@/utils/amount";
import { clamp, formatCreatedAt } from "@/app/(sidebar)/saving/_utils/saving.util";

/** 바닥·좌·우 벽 Body 생성 */
export const createWalls = (width: number, height: number): Body[] => [
  // 바닥
  Bodies.rectangle(
    width / 2,
    height + PIGGY_BANK.WALL_OFFSET,
    width + PIGGY_BANK.FLOOR_OVERFLOW,
    PIGGY_BANK.WALL_THICKNESS,
    {
      isStatic: true,
      render: { fillStyle: "transparent" },
    },
  ),
  // 왼쪽 벽
  Bodies.rectangle(-PIGGY_BANK.WALL_OFFSET, height / 2, PIGGY_BANK.WALL_THICKNESS, height, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  }),
  // 오른쪽 벽
  Bodies.rectangle(width + PIGGY_BANK.WALL_OFFSET, height / 2, PIGGY_BANK.WALL_THICKNESS, height, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  }),
];

/** 코인 원형 Body 생성 (위치·크기·스프라이트 계산 포함) */
export const createCoinBody = (
  name: string,
  amount: number,
  createdAt: string,
  targetAmount: number,
  size: { width: number; height: number },
): Body => {
  const { width, height } = size;
  const x = Math.max(
    PIGGY_BANK.BALL_DROP_OFFSET,
    Math.random() * (width - PIGGY_BANK.BALL_DROP_OFFSET * 2) + PIGGY_BANK.BALL_DROP_OFFSET,
  );
  const safeTarget = targetAmount > 0 ? targetAmount : 1;
  const radius = clamp(
    (height / 2) * Math.sqrt(amount / safeTarget),
    PIGGY_BANK.MIN_RADIUS,
    height / 2 - PIGGY_BANK.MIN_RADIUS,
  );
  const spriteScale = (radius * 2) / PIGGY_BANK.SCALE_BASE;
  const tooltipText = `저금 금액: ${formatAmount(Math.round(amount))}\n저금한 날: ${formatCreatedAt(createdAt)}`;

  return Bodies.circle(x, PIGGY_BANK.BALL_DROP_Y, radius, {
    plugin: {
      toolTip: tooltipText,
      label: name,
    },
    restitution: PIGGY_BANK.BALL_RESTITUTION,
    friction: PIGGY_BANK.BALL_FRICTION,
    render: {
      sprite: {
        texture: PIGGY_BANK.COIN_TEXTURE_PATH,
        xScale: spriteScale,
        yScale: spriteScale,
      },
    },
  });
};

/** canvas에 입금자 이름 라벨 그리기 */
export const renderLabels = (ctx: CanvasRenderingContext2D, bodies: Body[]): void => {
  ctx.save();
  ctx.fillStyle = PIGGY_BANK.LABEL_FILL_COLOR;
  ctx.font = PIGGY_BANK.LABEL_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  bodies.forEach((body: BallBody) => {
    if (body.isStatic || !body.plugin?.toolTip) return;
    const text = body.plugin.label;
    const radiusOffset = body.circleRadius ? body.circleRadius * PIGGY_BANK.LABEL_RADIUS_RATIO : 0;
    ctx.fillText(text, body.position.x, body.position.y + radiusOffset);
  });
  ctx.restore();
};

/** 마우스 좌표의 코인 Body 탐색 후 툴팁 데이터 반환 */
export const findTooltipTarget = (
  engine: Engine,
  canvas: HTMLCanvasElement,
  e: MouseEvent,
): ToolTipState | null => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const bodies = Query.point(engine.world.bodies, { x, y });
  const target = bodies.find((body) => body.plugin?.toolTip);

  if (!target) return null;

  return {
    visible: true,
    x,
    y,
    text: target.plugin.toolTip,
  };
};
