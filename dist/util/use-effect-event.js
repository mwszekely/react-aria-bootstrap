"use strict";
import { useCallback, useInsertionEffect, useRef } from "react";
const Unset = Symbol("unset");
export function useEffectEvent(value) {
  const ref = useRef(Unset);
  useInsertionEffect((() => {
    ref.current = value;
  }), [value]);
  return useCallback((...args) => {
    if (ref.current === Unset)
      throw new Error("Value retrieved from useEffectEvent() cannot be called during render (or useInsertionEffect).");
    return ref.current(...args);
  }, []);
}
