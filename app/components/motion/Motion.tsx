"use client";

// 사이트 전 테스트 플로우 공용 모션 1세트 (Framer Motion).
// - 문항 전환: x 슬라이드 + 페이드 (QuestionTransition: enter/exit, QuestionEnter: enter만)
// - 결과 리빌: 카드 scale/페이드 + 자식 stagger (revealVariants)
// - prefers-reduced-motion 존중 (거리/스태거 0, 짧은 페이드만)
// - 번들 최소화: LazyMotion + domAnimation + m (strict)
import {
  AnimatePresence,
  LazyMotion,
  m,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

// domAnimation 을 비동기 청크로 로드 (초기 번들 최소화).
const loadFeatures = () => import("./features").then((mod) => mod.default);

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];
export const T_QUESTION: Transition = { duration: 0.3, ease: EASE };
const T_FAST: Transition = { duration: 0.18, ease: EASE };

// 앱 루트에 1회 마운트 — 이하 모든 m.* 컴포넌트가 이 Provider 아래에서 동작.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

// 문항 전환 (enter + exit). motionKey 가 바뀌면 현재→다음 슬라이드+페이드.
export function QuestionTransition({
  motionKey,
  children,
  className,
}: {
  motionKey: string | number;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const d = reduce ? 0 : 26;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={motionKey}
        className={className}
        initial={{ opacity: 0, x: d }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -d }}
        transition={reduce ? T_FAST : T_QUESTION}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

// 문항 전환 (enter만) — 부모가 새 key 로 교체할 때 재생. 공용 질문 컴포넌트용.
export function QuestionEnter({
  motionKey,
  children,
  className,
}: {
  motionKey: string | number;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const d = reduce ? 0 : 22;
  return (
    <m.div
      key={motionKey}
      className={className}
      initial={{ opacity: 0, x: d }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduce ? T_FAST : T_QUESTION}
    >
      {children}
    </m.div>
  );
}

// 결과 리빌 변이 — 컨테이너(scale/페이드) + 아이템(stagger). active=false 면 무애니(정적).
export function revealVariants(active: boolean): { container: Variants; item: Variants } {
  if (!active) return { container: {}, item: {} };
  return {
    container: {
      initial: { opacity: 0, scale: 0.97 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.32,
          ease: EASE,
          when: "beforeChildren",
          staggerChildren: 0.06,
          delayChildren: 0.04,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
    },
  };
}

export { m, useReducedMotion };
