"use strict";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { mergeProps } from "react-aria";
import { useEffectEvent } from "./util/use-effect-event";
import { returnNull, runImmediately, useEnsureStability, usePassiveState } from "./util/use-passive-state";
function getTimeoutDuration(element) {
  if (typeof window === "undefined")
    return 250;
  return Math.max(...window.getComputedStyle(element || document.body).getPropertyValue(`transition-duration`).split(",").map((str) => {
    if (str.endsWith("ms"))
      return +str.substring(0, str.length - 2);
    if (str.endsWith("s"))
      return +str.substring(0, str.length - 1) * 1e3;
    return 1e3;
  }));
}
function parseState(nextState) {
  return nextState.split("-");
}
export function useTransition({
  propsIncoming: { children, ...p },
  show,
  animateOnMount,
  measure,
  exitVisibility,
  duration,
  delayMountUntilShown,
  easing,
  easingIn,
  easingOut,
  onVisibilityChange,
  classBase,
  classEnter,
  classExit,
  classMeasure,
  classFinalize,
  classInit,
  classTransition,
  elementRef,
  ...void2
}) {
  useEnsureStability("useTransition", onVisibilityChange);
  exitVisibility ||= "hidden";
  measure ??= false;
  classBase ??= "ptl";
  classEnter ??= "n";
  classExit ??= "x";
  classMeasure ??= "m";
  classFinalize ??= "f";
  classTransition ??= "t";
  classInit ??= "i";
  const GetDirectionClass = useCallback((direction) => {
    switch (direction) {
      case "enter":
        return classEnter;
      case "exit":
        return classExit;
    }
  }, []);
  const GetPhaseClass = useCallback((phase) => {
    switch (phase) {
      case "measure":
        return classMeasure;
      case "init":
        return classInit;
      case "transition":
        return classTransition;
      case "finalize":
        return classFinalize;
    }
  }, []);
  const getExitVisibility = useEffectEvent(() => exitVisibility);
  const getMeasure = useEffectEvent(() => measure);
  const cssProperties = useRef({});
  const classNames = useRef(/* @__PURE__ */ new Set([
    // This is removed during useLayoutEffect on the first render
    // (at least once `show` is non-null)
    `${classBase}-pending`,
    show === null ? "" : `${classBase}-${GetDirectionClass(show ? "enter" : "exit")}`,
    show !== null ? `${classBase}-${GetDirectionClass(show ? "enter" : "exit")}-${GetPhaseClass("finalize")}` : "",
    `${classBase}-ev-${exitVisibility}`
  ]));
  const handleTransitionFinished = useCallback(() => {
    const state = getState();
    console.assert(!!state);
    if (state) {
      const [direction, phase] = parseState(state);
      if (phase == "transition") {
        setState(`${direction}-finalize`);
        if (timeoutHandle.current > 0) {
          timeoutClearFunction.current?.(timeoutHandle.current);
          timeoutHandle.current = -1;
        }
      }
    }
  }, []);
  const otherProps = useRef({
    onTransitionEnd: (e) => {
      if (e.target == elementRef.current && e.elapsedTime) {
        handleTransitionFinished();
      }
    }
  });
  const hasMounted = useRef(false);
  const updateClasses = useCallback((element, direction, phase) => {
    if (element == null)
      return;
    const exitVisibility2 = getExitVisibility();
    const allClassesToRemove = [
      `${classBase}-${classEnter}`,
      `${classBase}-${classExit}`,
      `${classBase}-${classEnter}-${classMeasure}`,
      `${classBase}-${classEnter}-${classInit}`,
      `${classBase}-${classEnter}-${classTransition}`,
      `${classBase}-${classEnter}-${classFinalize}`,
      `${classBase}-${classExit}-${classMeasure}`,
      `${classBase}-${classExit}-${classInit}`,
      `${classBase}-${classExit}-${classTransition}`,
      `${classBase}-${classExit}-${classFinalize}`,
      `${classBase}-ev-${"inert"}`,
      `${classBase}-ev-${"removed"}`,
      `${classBase}-ev-${"hidden"}`,
      `${classBase}-ev-${"visible"}`,
      `${classBase}-pending`
    ];
    const allClassesToAdd = [
      `${classBase}`,
      `${classBase}-${GetDirectionClass(direction)}`,
      phase ? `${classBase}-${GetDirectionClass(direction)}-${GetPhaseClass(phase)}` : "",
      `${classBase}-ev-${exitVisibility2}`
    ];
    element.classList.remove(...allClassesToRemove);
    allClassesToRemove.map((v) => classNames.current.delete(v));
    element.classList.add(...allClassesToAdd);
    allClassesToAdd.map((v) => classNames.current.add(v));
  }, [classBase, classEnter, classExit, classInit, classTransition, classFinalize, classMeasure]);
  const updateSizeProperty = useCallback((element, varName, value) => {
    if (value != null) {
      value = `${value}px`;
      element.style.setProperty(varName, value);
      cssProperties.current[varName] = value;
    } else {
      element.style.removeProperty(varName);
      delete cssProperties.current[varName];
    }
  }, []);
  const measureElementAndUpdateProperties = useCallback((element, measure2) => {
    if (element) {
      let size = null;
      if (measure2) {
        size = element.getBoundingClientRect();
      }
      updateSizeProperty(element, `--${classBase}-measure-top`, size?.top);
      updateSizeProperty(element, `--${classBase}-measure-left`, size?.left);
      updateSizeProperty(element, `--${classBase}-measure-width`, size?.width);
      updateSizeProperty(element, `--${classBase}-measure-height`, size?.height);
    }
  }, []);
  const timeoutHandle = useRef(-1);
  const timeoutClearFunction = useRef(null);
  const onStateChange = useCallback((nextState, prevState, _reason) => {
    if (nextState == null)
      return;
    const [nextDirection, nextPhase] = parseState(nextState);
    const element = elementRef.current;
    if (timeoutHandle.current >= 0 && timeoutClearFunction.current)
      timeoutClearFunction.current(timeoutHandle.current);
    const exitVisibility2 = getExitVisibility();
    if (exitVisibility2) {
      const inert = exitVisibility2 == "inert" && (nextDirection == "exit" && nextPhase == "finalize") ? true : void 0;
      if (inert)
        otherProps.current.inert = true;
      else
        delete otherProps.current["inert"];
      if (element)
        element.inert = inert || false;
    }
    const isBeingPainted = nextDirection == "enter" || nextDirection == "exit" && nextPhase != "finalize";
    onVisibilityChange?.(isBeingPainted);
    updateClasses(element, nextDirection, nextPhase);
    if (element && (nextPhase == "init" || nextPhase == "transition"))
      forceReflow(element);
    switch (nextPhase) {
      case "measure": {
        if (element)
          measureElementAndUpdateProperties(element, true);
        updateClasses(element, nextDirection, "init");
        if (element)
          forceReflow(element);
      }
      case "init": {
        timeoutHandle.current = requestAnimationFrame(() => {
          setState(`${nextDirection}-transition`);
        });
        timeoutClearFunction.current = (f) => cancelAnimationFrame(f);
        break;
      }
      case "transition": {
        timeoutHandle.current = window.setTimeout(() => {
          handleTransitionFinished();
        }, getTimeoutDuration(element) * 1.5);
        timeoutClearFunction.current = (f) => clearTimeout(f);
        break;
      }
      case "finalize": {
        timeoutClearFunction.current = null;
        break;
      }
      default: {
        debugger;
        console.log(`Invalid state used in transition: ${nextState}. Previous state was ${prevState ?? "null"}`);
        break;
      }
    }
  }, [updateClasses]);
  const [getState, setState] = usePassiveState(onStateChange, returnNull, runImmediately);
  useLayoutEffect(() => internalOnShowChanged(show, measure), [measure, show]);
  function internalOnShowChanged(show2, measure2) {
    if (show2 == null)
      return;
    const currentState = getState();
    let nextPhase = measure2 ? "measure" : "init";
    if (currentState) {
      const [_currentDirection, currentPhase] = parseState(currentState);
      if (currentPhase != "finalize")
        nextPhase = "transition";
    }
    if (show2) {
      if (hasMounted.current || animateOnMount)
        setState(`enter-${nextPhase}`);
      else
        setState("enter-finalize");
    } else {
      if (hasMounted.current || animateOnMount)
        setState(`exit-${nextPhase}`);
      else
        setState("exit-finalize");
    }
    hasMounted.current = true;
  }
  const c = { ...cssProperties.current };
  if (duration != null)
    c[`--${classBase}-duration`] = duration + "ms";
  else
    delete c[`--${classBase}-duration`];
  easingIn ??= easing;
  easingOut ??= easing;
  if (easingOut != null)
    c[`--${classBase}-${classExit}-timing-function`] = easingOut;
  else
    delete c[`--${classBase}-${classExit}-timing-function`];
  if (easingIn != null)
    c[`--${classBase}-${classEnter}-timing-function`] = easingIn;
  else
    delete c[`--${classBase}-${classEnter}-timing-function`];
  cssProperties.current = c;
  const inlineDirection = null;
  const blockDirection = null;
  const definitelyShouldMountChildren = show || !delayMountUntilShown;
  const hasRenderedChildren = useRef(false);
  const renderChildren = definitelyShouldMountChildren || hasRenderedChildren.current;
  useEffect(() => {
    if (definitelyShouldMountChildren)
      hasRenderedChildren.current ||= true;
  }, [hasRenderedChildren.current ? false : definitelyShouldMountChildren]);
  const childrenIsVnode = children && children.type && children.props;
  const finalProps = mergeProps(p, { ref: elementRef }, otherProps.current, {
    className: [
      ...classNames.current,
      `${classBase}`,
      `${classBase}-ev-${exitVisibility}`,
      `${classBase}-inline-direction-${inlineDirection ?? "ltr"}`,
      `${classBase}-block-direction-${blockDirection ?? "ttb"}`
    ].join(" "),
    style: cssProperties.current
  }, childrenIsVnode ? children.props : {});
  return { mount: renderChildren, props: finalProps };
}
export function forceReflow(e) {
  const p = globalThis._dummy;
  globalThis._dummy = e.getBoundingClientRect();
  globalThis._dummy = e.style.opacity;
  globalThis._dummy = e.style.transform;
  globalThis._dummy = p;
  return e;
}
