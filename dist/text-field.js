"use strict";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useAsyncToSync } from "async-to-sync/react";
import clsx from "clsx";
import { cloneElement, createContext, forwardRef, isValidElement, use, useCallback, useEffect, useRef, useState } from "react";
import { mergeProps, useTextField } from "react-aria";
import { PendingSpinner } from "./spinner";
const InputGroupContext = createContext(false);
export function useIsInInputGroup() {
  return use(InputGroupContext);
}
export const InputGroup = forwardRef(function InputGroup2({ children, ...props }, ref) {
  return /* @__PURE__ */ jsx(InputGroupContext.Provider, { value: true, children: /* @__PURE__ */ jsx("div", { ref, ...mergeProps(props, { className: "input-group" }), children }) });
});
export function InputGroupText({ children, ...props }) {
  return /* @__PURE__ */ jsx("div", { ...mergeProps(props, { className: "input-group-text" }), children });
}
export function TextField({ text, onChange, validate, label, width, noSpinner, widthUnit, description, inline, inputGroup, placeholder, labelPosition, inputMode, disabled, maxLength, minLength, name, variantSize, readOnly, ...otherProps }) {
  const [optimistic, setOptimistic] = useState("");
  let ref = useRef(null);
  variantSize ??= "md";
  labelPosition ??= "before";
  widthUnit ??= "ch";
  const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync({ asyncInput: (v) => {
    const ret = onChange(v);
    return ret;
  }, capture: (e) => {
    setOptimistic(e);
    return [e];
  } });
  const valueUsed = pending ? optimistic : text;
  let {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
    validationDetails
  } = useTextField({ type: "text", value: valueUsed, onChange: syncOutput, placeholder, label, inputMode, maxLength, minLength, name, isDisabled: disabled, isReadOnly: readOnly, validate }, ref);
  const inALiteralActualInputGroupAlready = useIsInInputGroup();
  let mode = inputGroup ? inline ? "inline-solo-input-group" : "solo-input-group" : inline ? "inline-separate" : "default-separate";
  if (inALiteralActualInputGroupAlready) {
    if (inline || inputGroup)
      console.warn("A text field embedded in a pre-existing InputGroup will ignore the `inline` or `inputGroup` properties.");
    mode = "embedded-input-group";
  }
  return /* @__PURE__ */ jsx(
    TextFieldStructure,
    {
      mode,
      ref,
      isInvalid,
      groupProps: {},
      label,
      descriptionProps,
      errorMessageProps,
      inputProps,
      labelProps,
      pending,
      valueUsed,
      description,
      labelPosition,
      maxLength,
      noSpinner,
      validate,
      variantSize,
      width,
      widthUnit,
      validationErrors
    }
  );
}
export const TextFieldStructure = forwardRef(function TextFieldStructure2({ childrenPost, groupProps, widthTextValueOverride, mode, childrenPre, label, description, noSpinner, descriptionProps, isInvalid, errorMessageProps, validationErrors, variantSize, valueUsed, width, inputProps, labelProps, labelPosition, validate, maxLength, widthUnit, pending }, ref) {
  let columns = 1;
  if (labelPosition != "hidden")
    ++columns;
  if (description)
    ++columns;
  if (validate)
    ++columns;
  if (childrenPost != null)
    ++columns;
  if (childrenPre != null)
    ++columns;
  if (columns == 5)
    ++columns;
  if (width == "auto") {
    if (maxLength)
      width = maxLength;
    else {
      width = "auto";
      widthUnit = "px";
    }
  }
  const inALiteralActualInputGroupAlready = useIsInInputGroup();
  const inInputGroup2 = mode == "solo-input-group" || mode == "embedded-input-group" || mode == "inline-solo-input-group" || inALiteralActualInputGroupAlready;
  const [measuredWidth, setMeasuredWidth] = useState("");
  const spinner = noSpinner ? null : (pending || inInputGroup2) && /* @__PURE__ */ jsx(PendingSpinner, { labelId: labelProps.id, pending: pending ?? false, variantSize: variantSize == "lg" ? "md" : "sm" });
  const updateAutoWidth = useCallback((e) => {
    if (e.scrollWidth)
      setMeasuredWidth(e.scrollWidth.toString() ?? "");
  }, []);
  const ref2 = useRef(null);
  useEffect(() => {
    if (ref2.current?.scrollWidth && width == "auto")
      updateAutoWidth(ref2.current);
  }, [width, valueUsed]);
  function columnize(input, c) {
    return /* @__PURE__ */ jsx("div", { className: clsx("col-auto", c), children: input });
  }
  function textInputize(input, c) {
    return isValidElement(input) ? cloneElement(input, mergeProps({ className: "input-group-text" })) : /* @__PURE__ */ jsx("div", { className: "input-group-text", children: input });
  }
  let description2 = /* @__PURE__ */ jsx("div", { ...mergeProps(descriptionProps, { className: clsx("form-text") }), children: description });
  let error2 = /* @__PURE__ */ jsx("div", { ...mergeProps(errorMessageProps, { className: clsx("invalid-feedback", !isInvalid && "invisible") }), children: validationErrors.join(" ") });
  const measure2 = /* @__PURE__ */ jsx("div", { ref: (element) => {
    if (element) updateAutoWidth(element);
    return () => {
    };
  }, "aria-hidden": "true", className: `form-control form-control-measure form-control-${variantSize}`, children: widthTextValueOverride ?? valueUsed });
  const input2 = /* @__PURE__ */ jsx("input", { ...mergeProps(inputProps, { style: width ? { "--form-control-explicit-width": (measuredWidth || width)?.toString() } : void 0, className: clsx("form-control", pending && "pending", width && `form-control-explicit-width form-control-explicit-width-${widthUnit}`, `form-control-${variantSize}`) }), ref });
  const label2 = /* @__PURE__ */ jsx("label", { ...mergeProps(labelProps, { className: clsx("form-label", (mode == "inline-solo-input-group" || mode == "inline-separate") && "col-form-label") }), children: label });
  let noSpinnerPadding = inALiteralActualInputGroupAlready || noSpinner || mode == "solo-input-group" || mode == "inline-solo-input-group" || mode == "embedded-input-group";
  if (mode == "inline-separate") {
    return /* @__PURE__ */ jsxs("div", { ...groupProps, className: clsx("form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`, `row form-text-container-inline`, `g-${columns}`), children: [
      columnize(label2),
      childrenPre,
      columnize(/* @__PURE__ */ jsxs(Fragment, { children: [
        spinner,
        input2
      ] }), "position-relative"),
      width == "auto" && measure2,
      childrenPost,
      description && columnize(description2),
      validate && columnize(error2)
    ] });
  } else if (mode == "default-separate") {
    return /* @__PURE__ */ jsxs("div", { ...groupProps, className: clsx("form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`), children: [
      label2,
      childrenPre,
      /* @__PURE__ */ jsxs("div", { className: "form-text-container-spinner-container position-relative", children: [
        input2,
        spinner
      ] }),
      width == "auto" && measure2,
      childrenPost,
      description && description2,
      validate && error2
    ] });
  } else if (mode == "embedded-input-group") {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      textInputize(label2),
      childrenPre,
      input2,
      width == "auto" && measure2,
      spinner && textInputize(/* @__PURE__ */ jsx("div", { children: spinner })),
      childrenPost,
      description && textInputize(description2),
      validate && textInputize(error2)
    ] });
  } else if (mode == "solo-input-group") {
    columns = labelPosition == "hidden" ? 1 : 2;
    return /* @__PURE__ */ jsxs("div", { className: clsx("form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`, `g-${columns}`), children: [
      label2,
      /* @__PURE__ */ jsxs(InputGroup, { ...groupProps, children: [
        childrenPre,
        input2,
        width == "auto" && measure2,
        spinner && textInputize(/* @__PURE__ */ jsx("div", { children: spinner })),
        childrenPost,
        description && textInputize(description2),
        validate && textInputize(error2)
      ] })
    ] });
  } else if (mode == "inline-solo-input-group") {
    columns = labelPosition == "hidden" ? 1 : 2;
    return /* @__PURE__ */ jsxs("div", { className: clsx("form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`, `row form-text-container-inline`, `g-${columns}`), children: [
      columnize(label2),
      columnize(
        /* @__PURE__ */ jsxs(InputGroup, { ...groupProps, children: [
          childrenPre,
          input2,
          width == "auto" && measure2,
          spinner && textInputize(/* @__PURE__ */ jsx("div", { children: spinner })),
          childrenPost,
          description && textInputize(description2),
          validate && textInputize(error2)
        ] })
      )
    ] });
  }
});
