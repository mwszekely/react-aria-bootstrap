"use strict";
import { useCallback, useLayoutEffect, useRef } from "react";
function debounceRendering(f) {
  queueMicrotask(f);
}
export function useEnsureStability(parentHookName, ...values) {
  if (false)
    return;
  const helperToEnsureStability = useRef([]);
  const shownError = useRef([]);
  useHelper(values.length, -1);
  values.forEach(useHelper);
  return;
  function useHelper(value, i) {
    const index = i + 1;
    if (helperToEnsureStability.current[index] === void 0)
      helperToEnsureStability.current[index] = value;
    if (helperToEnsureStability.current[index] != value) {
      if (!shownError.current[index]) {
        debugger;
        console.error(`The hook ${parentHookName} requires some or all of its arguments remain stable across each render; please check the ${i}-indexed argument (${i >= 0 ? JSON.stringify(values[i]) : "the number of supposedly stable elements"}).`);
        shownError.current[index] = true;
      }
    }
  }
}
export function usePassiveState(onChange, getInitialValue, customDebounceRendering) {
  const valueRef = useRef(Unset);
  const reasonRef = useRef(Unset);
  const warningRef = useRef(false);
  const dependencyToCompareAgainst = useRef(Unset);
  const cleanupCallbackRef = useRef(void 0);
  useEnsureStability("usePassiveState", onChange, getInitialValue, customDebounceRendering);
  const onShouldCleanUp = useCallback(() => {
    const cleanupCallback = cleanupCallbackRef.current;
    if (cleanupCallback)
      cleanupCallback();
  }, []);
  const tryEnsureValue = useCallback(() => {
    if (valueRef.current === Unset && getInitialValue != void 0) {
      try {
        const initialValue = getInitialValue();
        valueRef.current = initialValue;
        cleanupCallbackRef.current = onChange?.(initialValue, void 0, void 0) ?? void 0;
      } catch (ex) {
      }
    }
  }, [
    /* getInitialValue and onChange intentionally omitted */
  ]);
  const getValue = useCallback(() => {
    if (warningRef.current)
      console.warn("During onChange, prefer using the (value, prevValue) arguments instead of getValue -- it's ambiguous as to if you're asking for the old or new value at this point in time for this component.");
    if (valueRef.current === Unset)
      tryEnsureValue();
    return valueRef.current === Unset ? void 0 : valueRef.current;
  }, []);
  useLayoutEffect(() => {
    tryEnsureValue();
  }, []);
  const setValue = useCallback((arg, reason) => {
    const nextValue = arg instanceof Function ? arg(valueRef.current === Unset ? void 0 : valueRef.current) : arg;
    if (
      /*dependencyToCompareAgainst.current === Unset &&*/
      nextValue !== valueRef.current
    ) {
      dependencyToCompareAgainst.current = valueRef.current;
      valueRef.current = nextValue;
      reasonRef.current = reason;
      (customDebounceRendering ?? debounceRendering)(() => {
        const nextReason = reasonRef.current;
        const nextDep = valueRef.current;
        const prevDep = dependencyToCompareAgainst.current;
        if (dependencyToCompareAgainst.current != valueRef.current) {
          valueRef.current = dependencyToCompareAgainst.current = Unset;
          warningRef.current = true;
          try {
            onShouldCleanUp();
            valueRef.current = nextDep;
            cleanupCallbackRef.current = onChange?.(nextDep, prevDep === Unset ? void 0 : prevDep, nextReason) ?? void 0;
          } finally {
            warningRef.current = false;
          }
        }
        dependencyToCompareAgainst.current = Unset;
      });
    }
  }, []);
  return [getValue, setValue];
}
const Unset = Symbol();
export function returnTrue() {
  return true;
}
export function returnFalse() {
  return false;
}
export function returnNull() {
  return null;
}
export function returnUndefined() {
  return void 0;
}
export function returnZero() {
  return 0;
}
export function runImmediately(f) {
  f();
}
