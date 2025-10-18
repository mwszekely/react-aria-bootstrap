import { useCallback, useInsertionEffect, useRef } from "react";

const Unset = Symbol("unset");

type FunctionType<Args extends unknown[], Ret> = (...args: Args) => Ret;

// TODO: When the actual useEffectEvent is finally ready 
// (guys please we're closing in on a decade without a hook like this please please please just let us use it)
// get rid of this.
export function useEffectEvent<Args extends unknown[], Ret>(value: FunctionType<Args, Ret>): FunctionType<Args, Ret> {
    const ref = useRef<FunctionType<Args, Ret>>(Unset as unknown as FunctionType<Args, Ret>);
    useInsertionEffect((() => { ref.current = value; }), [value]);

    return useCallback<FunctionType<Args, Ret>>((...args) => {
        if (ref.current as unknown === Unset)
            throw new Error('Value retrieved from useEffectEvent() cannot be called during render (or useInsertionEffect).')

        return ref.current(...args);
    }, []);
}
