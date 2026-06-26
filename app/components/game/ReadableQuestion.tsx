"use client";

import type { ReactElement } from "react";
import type { SimpleLocale } from "@/hooks/useLocale";
import { m, T_QUESTION, useReducedMotion } from "@/app/components/motion/Motion";

type ReadableQuestionProps = {
  prompt: string;
  locale: SimpleLocale;
  situation?: string;
  situationLabel?: string;
  promptLabel?: string;
};

function splitPrompt(prompt: string): { situation: string; question: string } {
  const trimmed = prompt.trim();
  const explicit = trimmed
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (explicit.length > 1) {
    return {
      situation: explicit.slice(0, -1).join("\n"),
      question: explicit[explicit.length - 1],
    };
  }

  const sentences = trimmed
    .match(/[^.!?。！？]+[.!?。！？]?/g)
    ?.map((part) => part.trim())
    .filter(Boolean);

  if (!sentences || sentences.length < 2 || trimmed.length < 58) {
    return { situation: "", question: trimmed };
  }

  const questionIndex = sentences.findIndex(
    (sentence, index) => index > 0 && /[?？]$/.test(sentence),
  );

  if (questionIndex > 0) {
    return {
      situation: sentences.slice(0, questionIndex).join(" "),
      question: sentences.slice(questionIndex).join(" "),
    };
  }

  return {
    situation: sentences.slice(0, -1).join(" "),
    question: sentences[sentences.length - 1],
  };
}

export default function ReadableQuestion({
  prompt,
  locale,
  situation,
  situationLabel,
  promptLabel,
}: ReadableQuestionProps): ReactElement {
  const split = splitPrompt(prompt);
  const situationText = situation?.trim() || split.situation;
  const questionText = split.question;
  const defaultSituationLabel = locale === "ko" ? "상황" : "Situation";
  const defaultPromptLabel = locale === "ko" ? "질문" : "Question";
  const reduce = useReducedMotion();

  return (
    <m.div
      className="readable-question"
      key={prompt}
      initial={{ opacity: 0, x: reduce ? 0 : 22 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduce ? { duration: 0.18 } : T_QUESTION}
    >
      {situationText && (
        <div className="readable-question__situation">
          <span>{situationLabel ?? defaultSituationLabel}</span>
          <p>{situationText}</p>
        </div>
      )}
      <div className="readable-question__prompt">
        {situationText && <span>{promptLabel ?? defaultPromptLabel}</span>}
        <h2>{questionText}</h2>
      </div>
    </m.div>
  );
}
