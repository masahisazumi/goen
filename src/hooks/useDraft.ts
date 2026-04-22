"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "goen:draft:";

type Stored<T> = {
  data: T;
  savedAt: number;
};

type UseDraftOptions = {
  debounceMs?: number;
  enabled?: boolean;
};

export function useDraft<T>(
  key: string,
  value: T,
  options: UseDraftOptions = {}
) {
  const { debounceMs = 600, enabled = true } = options;
  const storageKey = `${STORAGE_PREFIX}${key}`;

  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRunRef = useRef(true);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const now = Date.now();
        const payload: Stored<T> = { data: value, savedAt: now };
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
        setSavedAt(now);
      } catch {
        // quota / serialization error — ignore
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, enabled, storageKey, debounceMs]);

  useEffect(() => {
    return () => {
      if (timerRef.current && enabled && typeof window !== "undefined") {
        clearTimeout(timerRef.current);
        try {
          const payload: Stored<T> = {
            data: valueRef.current,
            savedAt: Date.now(),
          };
          window.localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch {
          // ignore
        }
      }
    };
  }, [enabled, storageKey]);

  const loadDraft = useCallback((): Stored<T> | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as Stored<T>;
    } catch {
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(storageKey);
      setSavedAt(null);
      firstRunRef.current = true;
    } catch {
      // ignore
    }
  }, [storageKey]);

  return { loadDraft, clearDraft, savedAt };
}
