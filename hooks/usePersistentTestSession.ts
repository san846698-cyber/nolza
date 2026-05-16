"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options<T> = {
  validate?: (value: unknown) => value is T;
};

export function usePersistentTestSession<T>(
  storageKey: string,
  initialState: T,
  options: Options<T> = {},
) {
  const initialRef = useRef(initialState);
  const validateRef = useRef(options.validate);
  const [state, setState] = useState<T>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let nextState = initialRef.current;
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (!validateRef.current || validateRef.current(parsed)) {
          nextState = parsed as T;
        }
      }
    } catch {
      nextState = initialRef.current;
    }
    setState(nextState);
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Progress persistence is a resilience layer; storage failures should not
      // interrupt the quiz.
    }
  }, [hydrated, state, storageKey]);

  const resetSession = useCallback((nextState: T = initialRef.current) => {
    setState(nextState);
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(nextState));
    } catch {
      // Ignore storage failures.
    }
  }, [storageKey]);

  return [state, setState, resetSession, hydrated] as const;
}
