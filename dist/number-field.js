"use strict";
import { jsx, jsxs } from "react/jsx-runtime";
import { useAsyncToSync } from "async-to-sync/react";
import { useMemo, useRef, useState } from "react";
import { useLocale, useNumberField, useNumberFormatter } from "react-aria";
import { useNumberFieldState } from "react-stately";
import { ActionButton } from "./button";
import { TextFieldStructure, useIsInInputGroup } from "./text-field";
export function NumberField({ value, min, max, description, validate, formatOptions, noButtons, disabled, onChange, noSpinner, errorMessage, invalid, inline, minWidth, label, labelPosition, placeholder, readOnly, step, width, widthUnit, variantSize }) {
  const locale = useLocale();
  const [optimistic, setOptimistic] = useState(value);
  variantSize ??= "md";
  labelPosition ??= "before";
  widthUnit ??= "ch";
  const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync({
    asyncInput: (v) => {
      const ret2 = onChange(v);
      return ret2;
    },
    capture: (e) => {
      setOptimistic(e);
      return [+e];
    }
  });
  const valueUsed = pending ? optimistic : value;
  const Opts = {
    value: valueUsed ?? void 0,
    minValue: min,
    maxValue: max,
    locale: locale.locale,
    description,
    errorMessage,
    formatOptions: void 0,
    isRequired: void 0,
    label,
    isReadOnly: readOnly,
    isInvalid: invalid,
    isDisabled: disabled,
    step,
    placeholder: placeholder?.toString(),
    validate,
    onChange: syncOutput
  };
  const ref = useRef(null);
  const state = useNumberFieldState(Opts);
  const {
    decrementButtonProps,
    descriptionProps,
    errorMessageProps,
    groupProps,
    incrementButtonProps,
    inputProps,
    isInvalid,
    labelProps,
    validationDetails,
    validationErrors
  } = useNumberField(Opts, state, ref);
  const isInInputGroup = useIsInInputGroup();
  const buttons = noButtons ? null : /* @__PURE__ */ jsxs("div", { className: "number-field-buttons btn-group-vertical", children: [
    /* @__PURE__ */ jsx(ActionButton, { outsetVariant: "inset", fillVariant: "outlined", themeVariant: "secondary", ...incrementButtonProps, children: "+" }),
    /* @__PURE__ */ jsx(ActionButton, { outsetVariant: "inset", fillVariant: "outlined", themeVariant: "secondary", ...decrementButtonProps, children: "-" })
  ] });
  const inputGroup = true;
  let textValueFormatter = useNumberFormatter({ ...formatOptions, currencySign: void 0 });
  let textValue = useMemo(() => valueUsed == null || isNaN(valueUsed) ? "" : textValueFormatter.format(valueUsed), [textValueFormatter, valueUsed]);
  let ret = /* @__PURE__ */ jsx(
    TextFieldStructure,
    {
      mode: isInInputGroup ? "embedded-input-group" : inputGroup ? inline ? "inline-solo-input-group" : "solo-input-group" : inline ? "inline-separate" : "default-separate",
      ref,
      descriptionProps,
      errorMessageProps,
      inputProps,
      isInvalid,
      minWidth: minWidth ?? "0px",
      label,
      labelProps,
      groupProps,
      pending,
      validationErrors,
      valueUsed,
      description,
      labelPosition,
      noSpinner,
      validate,
      childrenPost: buttons,
      variantSize,
      width,
      widthUnit,
      widthTextValueOverride: textValue
    }
  );
  return ret;
}
