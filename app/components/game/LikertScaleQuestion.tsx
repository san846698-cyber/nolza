"use client";

import { useMemo, useState, type ReactElement } from "react";
import type { SimpleLocale } from "@/hooks/useLocale";
import ReadableQuestion from "./ReadableQuestion";

export type LikertChoice<T extends string> = {
  id: string;
  text: { ko: string; en: string };
  weights: Partial<Record<T, number>>;
};

export type LikertRating<T extends string> = {
  choiceId: string;
  value: number;
  weights: Partial<Record<T, number>>;
};

type LikertScaleQuestionProps<T extends string> = {
  choices: LikertChoice<T>[];
  locale: SimpleLocale;
  onSubmit: (ratings: LikertRating<T>[]) => void;
  prompt: string;
};

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

function copy(locale: SimpleLocale, ko: string, en: string): string {
  return locale === "ko" ? ko : en;
}

function text(locale: SimpleLocale, value: { ko: string; en: string }): string {
  return locale === "ko" ? value.ko : value.en;
}

export default function LikertScaleQuestion<T extends string>({
  choices,
  locale,
  onSubmit,
  prompt,
}: LikertScaleQuestionProps<T>): ReactElement {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const complete = choices.every((choice) => typeof ratings[choice.id] === "number");

  const selectedCount = useMemo(
    () => choices.filter((choice) => typeof ratings[choice.id] === "number").length,
    [choices, ratings],
  );

  return (
    <>
      <ReadableQuestion prompt={prompt} locale={locale} />
      <div className="likert-question" aria-label={copy(locale, "7점 척도 응답", "7-point scale")}>
        <div className="likert-question__head">
          <span>{copy(locale, "1–7 동의 척도", "1-7 agreement scale")}</span>
          <strong>
            {selectedCount}/{choices.length}
          </strong>
        </div>
        <p className="likert-question__help">
          {copy(
            locale,
            "각 문장이 나에게 얼마나 가까운지 표시해주세요.",
            "Rate how closely each statement feels like you.",
          )}
        </p>
        <div className="likert-question__labels" aria-hidden="true">
          <span>{copy(locale, "1 전혀 아니다", "1 Strongly disagree")}</span>
          <span>{copy(locale, "4 보통이다", "4 Neutral")}</span>
          <span>{copy(locale, "7 매우 그렇다", "7 Strongly agree")}</span>
        </div>
        <div className="likert-question__items">
          {choices.map((choice, index) => (
            <section className="likert-item" key={choice.id}>
              <p>
                <span>{String.fromCharCode(65 + index)}</span>
                {text(locale, choice.text)}
              </p>
              <div className="likert-scale" role="radiogroup" aria-label={text(locale, choice.text)}>
                {SCALE_VALUES.map((value) => (
                  <button
                    aria-checked={ratings[choice.id] === value}
                    className={ratings[choice.id] === value ? "is-selected" : ""}
                    key={value}
                    onClick={() => setRatings((current) => ({ ...current, [choice.id]: value }))}
                    role="radio"
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        <button
          className="likert-submit"
          disabled={!complete}
          onClick={() =>
            onSubmit(
              choices.map((choice) => ({
                choiceId: choice.id,
                value: ratings[choice.id] ?? 4,
                weights: choice.weights,
              })),
            )
          }
          type="button"
        >
          {copy(locale, "다음 문항", "Next question")}
        </button>
      </div>
    </>
  );
}
