import { AllHTMLAttributes, CSSProperties, HTMLAttributes, ReactElement, RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { mergeProps } from "react-aria";
import { useEffectEvent } from "./util/use-effect-event";
import { OnPassiveStateChange, returnNull, runImmediately, useEnsureStability, usePassiveState } from "./util/use-passive-state";


export type ExitVisibility = "inert" | "removed" | "hidden" | "visible"

export type TransitionPhase = 'measure' | 'init' | 'transition' | 'finalize';
export type TransitionDirection = 'enter' | 'exit';
export type TransitionState = `${TransitionDirection}-${TransitionPhase}`;

export type OmitStrong<T, K extends keyof T> = Omit<T, K>;
export type PseudoRequired<T> = { [P in keyof T]-?: T[P] | undefined; };
export type PseudoPartial<T> = { [P in keyof T]: T[P] | undefined; };

// Needed for `extends` statements for some reason??
export type Get<T, K extends keyof T> = Pick<T, K>[K];

/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * The hooks that create the base props have parameters that inherit from this.
 * 
 * All of them need the transition's `classBase`, and some also inspect `show`.
 */
//export interface UseBasePropsBaseParameters {}

export interface UseTransitionParametersSelf<E extends Element> {

    /**
     * The easing to use for the transition.
     * 
     * If undefined, it's the same value as defined in the corresponding Sass variable.
     */
    easing?: string;

    /**
     * The easing to use when `show` becomes `true`.
     * 
     * If unspecified, it's the same value as `easing`.
     */
    easingIn?: string;

    /**
     * The easing to use when `show` becomes `false`.
     * 
     * If unspecified, it's the same value as `easing`.
     */
    easingOut?: string;

    /**
     * These props will be merged with whatever's necessary to provide transitions (CSS classes, styles, events, etc.)
     * and returned as a separate object.
     * 
     */
    propsIncoming: AllHTMLAttributes<E>;

    /**
     * 
     * If true, this element should make itself visible.
     */
    show: boolean | null;

    /**
     * Controls whether or not the element mounts in an already-transitioned appearance or not.
     */
    animateOnMount?: boolean;

    /**
     * Certain types of transitions require measuring the size of the element (e.g. `Collapse`).
     * 
     * It incurs a reflow-based performance penalty every time `visible` changes when used.
     * 
     * Most interfaces that inherit this one will pick a value for `measure` and omit it as an option.
     */
    measure: boolean;

    /**
     * Allows customizing the class name used by all transition-relevant CSS classes.
     * 
     * This should match the Sass variable `$transition-class-base`, which is `"ptl"` by default.
     * 
     * Cannot change while the element is mounted; it **MUST** remain stable throughout the component's lifetime.
     * 
     * @default "ptl"
     */
    classBase?: string;

    classExit?: string;
    classEnter?: string;
    classTransition?: string;
    classMeasure?: string;
    classFinalize?: string;
    classInit?: string;
    /**
     * Can also be provided via CSS properties (but this will match whatever `classBase` you use for you)
     */
    duration?: number;

    /**
     * After the element has finished its exit animation, what happens to it?
     * 
     * * `"removed"`: `display: none` is applied.
     * * `"hidden"`: `visibility: none` is applied.
     * * `"visible"`: No additional styling is applied.
     * * `"inert"`: No additional styling is applied, but the `inert` attribute is applied. You will likely need a polyfill to make this work on older browsers (read: not-that-old iOS devices).
     */
    exitVisibility?: ExitVisibility;

    /**
     * By default, this component does not re-render when its visibility changes,
     * it only updates CSS classes and does some other bookkeeping.
     * 
     * If you want to re-render when the component becomes visible/hidden,
     * you can set some state here.
     * 
     * This is correlated with your `show` prop; when `show` becomes
     * `true` so does `visible`, but when `show` becomes `false`,
     * this won't fire back with `false` until the transition ends.
     * 
     * @param visible 
     */
    onVisibilityChange?: (visible: boolean) => void;


    /**
     * 
     */
    delayMountUntilShown?: boolean | undefined;

    elementRef: RefObject<E | null>;
}



/**
 * All attributes are merged, but autocomplete becomes really noisy trying to find the props that are relevant to the `Transitionable` itself. 
 * To avoid wading through a sea of event handlers and attributes no one ever uses, only the most common ones are shown.
 * 
 * Again, though, **all props are merged and forwarded, not just these ones!** You can use any/all of the usual attributes, including `onTransitionEnd`.
 */
export interface NonIntrusiveElementAttributes<E extends Element> extends Pick<AllHTMLAttributes<E>, "children" | "style" | "className"> { }





function getTimeoutDuration<E extends HTMLElement>(element: E | null) {
    if (typeof window === 'undefined')
        return 250;

    return Math.max(...(window.getComputedStyle(element || document.body).getPropertyValue(`transition-duration`)).split(",").map(str => {
        if (str.endsWith("ms"))
            return +str.substring(0, str.length - 2);
        if (str.endsWith("s"))
            return (+str.substring(0, str.length - 1)) * 1000;
        return 1000;
    }));
}

function parseState(nextState: TransitionState) {
    return nextState.split("-") as [TransitionDirection, TransitionPhase];
}

/**
 * Provide props that can be used to animate a transition.
 * 
 * @compositeParams
 */
export function useTransition<E extends HTMLElement>({
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
}: UseTransitionParametersSelf<E>): { props: {}, mount: boolean } {
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

    const GetDirectionClass = useCallback((direction: TransitionDirection): string => { switch (direction) { case "enter": return classEnter; case "exit": return classExit; } }, []);
    const GetPhaseClass = useCallback((phase: TransitionPhase): string => { switch (phase) { case "measure": return classMeasure; case "init": return classInit; case "transition": return classTransition; case "finalize": return classFinalize } }, []);

    const getExitVisibility = useEffectEvent(() => exitVisibility);
    const getMeasure = useEffectEvent(() => measure);

    const cssProperties = useRef<Partial<Record<string, string>>>({});
    const classNames = useRef(new Set<string>([
        // This is removed during useLayoutEffect on the first render
        // (at least once `show` is non-null)
        `${classBase}-pending`,
            show === null? '' : `${classBase}-${GetDirectionClass(show? "enter" : "exit")}`,
            show !== null? `${classBase}-${GetDirectionClass(show? "enter" : "exit")}-${GetPhaseClass("finalize")}` : "",
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
    }, [])
    const otherProps = useRef<HTMLAttributes<E>>({
        onTransitionEnd: (e) => {
            if (e.target == elementRef.current && e.elapsedTime) {
                handleTransitionFinished();
            }
        }
    })

    const hasMounted = useRef(false);

    /**
     * Sets the element's CSS class to match the given direction and phase.
     */
    const updateClasses = useCallback((element: Element | null, direction: TransitionDirection, phase?: TransitionPhase) => {
        if (element == null)
            return;


        const exitVisibility = getExitVisibility();

        const allClassesToRemove = [
            `${classBase}-${classEnter}`, `${classBase}-${classExit}`,
            `${classBase}-${classEnter}-${classMeasure}`, `${classBase}-${classEnter}-${classInit}`, `${classBase}-${classEnter}-${classTransition}`, `${classBase}-${classEnter}-${classFinalize}`,
            `${classBase}-${classExit}-${classMeasure}`, `${classBase}-${classExit}-${classInit}`, `${classBase}-${classExit}-${classTransition}`, `${classBase}-${classExit}-${classFinalize}`,
            `${classBase}-ev-${"inert"}`,
            `${classBase}-ev-${"removed"}`,
            `${classBase}-ev-${"hidden"}`,
            `${classBase}-ev-${"visible"}`,
            `${classBase}-pending`,
        ];

        const allClassesToAdd = [
            `${classBase}`,
            `${classBase}-${GetDirectionClass(direction)}`,
            phase ? `${classBase}-${GetDirectionClass(direction)}-${GetPhaseClass(phase)}` : "",
            `${classBase}-ev-${exitVisibility}`
        ];

        element.classList.remove(...allClassesToRemove);
        allClassesToRemove.map(v => classNames.current.delete(v));

        element.classList.add(...allClassesToAdd);
        allClassesToAdd.map(v => classNames.current.add(v));

    }, [classBase, classEnter, classExit, classInit, classTransition, classFinalize, classMeasure]);

    /**
     * Updates a single "measure" variable (or removes it)
     */
    const updateSizeProperty = useCallback((element: HTMLElement, varName: (keyof CSSProperties) & string, value: string | number | null | undefined) => {
        if (value != null) {
            value = `${value}px`;
            element.style.setProperty(varName, value);
            cssProperties.current[varName] = value;
        }
        else {
            element.style.removeProperty(varName);
            delete cssProperties.current[varName];
        }
    }, []);

    /**
     * Adds the "measure" variables to the element if requested.
     * 
     * TODO: This is only used once and could/should be inlined
     */
    const measureElementAndUpdateProperties = useCallback((element: HTMLElement | null, measure: boolean) => {
        if (element) {
            let size: DOMRectReadOnly | null = null;
            if (measure) {
                size = element.getBoundingClientRect();
            }

            updateSizeProperty(element, `--${classBase}-measure-top` as never, size?.top);
            updateSizeProperty(element, `--${classBase}-measure-left` as never, size?.left);
            updateSizeProperty(element, `--${classBase}-measure-width` as never, size?.width);
            updateSizeProperty(element, `--${classBase}-measure-height` as never, size?.height);
        }
    }, []);

    // We use both useTimeout and requestAnimationFrame for timing certain things --
    // raf is used for changing from init to transition (would use queueMicrotask but it can't be cancelled)
    // setTimeout is used for changing from transition to finalize (as a backup in case transitionend doesn't fire)
    //
    // In order to avoid stale callbacks running (i.e. when we rapidly switch between visible and not)
    // we need to make sure we accurately cancel anything that can change our state on a delay.
    //
    // Also of note, we store "(f) => window.clearTimeout(f)" instead of just "window.clearTimeout" because
    // of the implicit window object -- problems with a missing `this` object and all that nonsense.
    const timeoutHandle = useRef<number>(-1);
    const timeoutClearFunction = useRef<(typeof cancelAnimationFrame) | (typeof clearTimeout) | null>(null);

    /**
     * Any time the state changes, there's some logic we need to run:
     * 
     * * If we're changing to an `init` phase, update the classes, then wait a moment and then change to the `transition` phase.
     * * If we're changing to a `transition` phase, update the classes, then wait until the transition completes, then change to the `finalize` phase.
     * 
     * Any change in state or classes/styles does not implicitly cause a re-render.
     */
    const onStateChange = useCallback<OnPassiveStateChange<TransitionState | null, undefined>>((nextState, prevState, _reason) => {
        if (nextState == null)
            return;

        const [nextDirection, nextPhase] = parseState(nextState);
        const element = elementRef.current;

        // Make sure no stale change code ever runs
        if (timeoutHandle.current >= 0 && timeoutClearFunction.current)
            timeoutClearFunction.current(timeoutHandle.current);

        // Handle inert props/property
        const exitVisibility = getExitVisibility();
        if (exitVisibility) {
            const inert = (exitVisibility == "inert" && (nextDirection == "exit" && nextPhase == "finalize") ? true : undefined);
            if (inert)
                (otherProps.current as any).inert = true;
            else
                delete otherProps.current["inert" as never];

            if (element)
                element.inert = (inert || false);
        }

        const isBeingPainted = (nextDirection == "enter" || (nextDirection == "exit" && nextPhase != "finalize"));
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

                // !!Intentional fall-through!!
                /* eslint-disable no-fallthrough */
            }
            case "init": {
                timeoutHandle.current = requestAnimationFrame(() => { setState(`${nextDirection}-transition`); });
                timeoutClearFunction.current = (f: number) => cancelAnimationFrame(f)
                break;
            }
            case "transition": {
                timeoutHandle.current = window.setTimeout(() => {
                    handleTransitionFinished();
                }, getTimeoutDuration(element) * 1.5);
                timeoutClearFunction.current = (f: number) => clearTimeout(f)
                break;
            }
            case "finalize": {
                // Nothing to do or schedule or anything -- we just update our classes and we're done.
                timeoutClearFunction.current = null;    // Does this make it more or less clear?

                break;
            }
            default: {
                /* eslint-disable no-debugger */
                debugger; // Intentional
                console.log(`Invalid state used in transition: ${nextState}. Previous state was ${prevState ?? "null"}`);
                break;
            }
        }
    }, [updateClasses]);


    const [getState, setState] = usePassiveState<TransitionState | null, undefined>(onStateChange, returnNull, runImmediately);

    // When we mount, and every time thereafter that `show` changes,
    // change our current state according to that `show` value.
    useLayoutEffect(() => internalOnShowChanged(show, measure), [measure, show]);


    // This has no dependencies and is relied on in two different areas
    function internalOnShowChanged(show: boolean | null, measure: boolean) {

        // If `show` is null, then we don't change anything.
        if (show == null)
            return;

        // (If `show` is true/false, we'll remove the CSS classes during `onChange`)

        const currentState = getState();
        let nextPhase: TransitionPhase = measure ? "measure" : "init";
        if (currentState) {
            const [_currentDirection, currentPhase] = parseState(currentState);
            if (currentPhase != "finalize")
                nextPhase = "transition";
        }

        // Note: the setState change handler runs immediately with no debounce.
        if (show) {
            if (hasMounted.current || animateOnMount)
                setState(`enter-${nextPhase}`);

            else
                setState("enter-finalize");

        }
        else {
            if (hasMounted.current || animateOnMount)
                setState(`exit-${nextPhase}`);
            else
                setState("exit-finalize");
        }

        hasMounted.current = true;
    }

    const c = {...cssProperties.current};
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


    // TODO
    const inlineDirection = null;
    const blockDirection = null;



    // No matter what delayMountUntilShown is,
    // once we've rendered our children once, 
    // ensure that we don't unmount them again and waste all that work.
    // (If you really need this you can just unmount the entire transition itself)
    const definitelyShouldMountChildren = (show || !delayMountUntilShown);
    const hasRenderedChildren = useRef(false);
    const renderChildren = definitelyShouldMountChildren || hasRenderedChildren.current;
    useEffect(() => {
        if (definitelyShouldMountChildren)
            hasRenderedChildren.current ||= true;
    }, [hasRenderedChildren.current ? false : definitelyShouldMountChildren]);

    const childrenIsVnode = (children && (children as ReactElement).type && (children as ReactElement).props);
    const finalProps = mergeProps(p, { ref: elementRef }, otherProps.current, {
        className: [
            ...classNames.current,
            `${classBase}`,
            `${classBase}-ev-${exitVisibility}`,
            `${classBase}-inline-direction-${inlineDirection ?? "ltr"}`,
            `${classBase}-block-direction-${blockDirection ?? "ttb"}`
        ].join(" "),
        style: cssProperties.current
    }, childrenIsVnode ? (children as any).props : {});



    return { mount: renderChildren, props: finalProps }
}



export function forceReflow<E extends HTMLElement>(e: E) {

    // Try really hard to make sure this isn't optimized out by anything.
    // We need it for its document reflow side effect.
    const p = (globalThis as any)._dummy;
    (globalThis as any)._dummy = e.getBoundingClientRect();
    (globalThis as any)._dummy = e.style.opacity;
    (globalThis as any)._dummy = e.style.transform;
    (globalThis as any)._dummy = p;
    return e;
}
