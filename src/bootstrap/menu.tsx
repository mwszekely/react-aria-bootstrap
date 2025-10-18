import { CollectionChildren } from "@react-types/shared";
import { useRef } from "react";
import { AriaMenuProps, AriaMenuTriggerProps, AriaPopoverProps, DismissButton, mergeProps, Overlay, usePopover } from "react-aria";
import { OverlayTriggerState } from "react-stately";
import { ActionButtonProps } from "./button";

export interface MenuProps extends Pick<AriaMenuProps<HTMLDivElement>, "children" | "selectionMode" | "onSelectionChange" | "items"> {

}

// <AriaMenuTriggerProps<HTMLDivElement>, "children" | "selectionMode" | "onSelectionChange" | "items"
export interface MenuTriggerProps extends Pick<ActionButtonProps, "fillVariant" | "sizeVariant" | "themeVariant" | "outsetVariant" | "isDisabled">, Pick<AriaMenuTriggerProps, "isDisabled"> {
  menuChildren: CollectionChildren<HTMLDivElement>;
}


interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

function Popover({ children, state, ...props }: PopoverProps) {
  let popoverRef = useRef(null);
  let { popoverProps, underlayProps } = usePopover({ ...props, popoverRef }, state);

  return (
    <Overlay>
      <div {...underlayProps} style={{ position: 'fixed', inset: 0 }} />
      <div {...mergeProps(popoverProps, { className: "popover" })} ref={popoverRef}>
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
/*
export function MenuTriggerButton(allProps: MenuTriggerProps) {
  const menuTriggerPropsA: AriaMenuTriggerProps = { isDisabled: allProps.isDisabled, type: "menu", trigger: "press" };
  const buttonPropsU: ActionButtonProps = {};
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const state = useMenuTriggerState({ isOpen: open, onOpenChange: setOpen });
  const { menuProps, menuTriggerProps } = useMenuTrigger(menuTriggerPropsA, state, ref);

  return (
    <>
      <ActionButton {...mergeProps(buttonPropsU, menuTriggerProps)} />
      {state.isOpen &&
        (
          <Popover state={state} triggerRef={ref} placement="bottom start">
            <Menu {...menuProps} children={allProps.menuChildren} />
          </Popover>
        )}

    </>
  )
}

export function Menu({ children, items, isDisabled, onSelectionChange, selectionMode }: MenuProps) {

  const menuTriggerProps: AriaMenuTriggerProps = {
    isDisabled,
    trigger,
    type: "menu"
  }

  const menuProps: AriaMenuProps<HTMLDivElement> = {
    children,
    items,
    onSelectionChange,
    selectionMode
  };

  const ref = useRef(null);
  const state = useMenuTriggerState(menuTriggerProps)
  useMenuTrigger(menuTriggerProps, state, ref);


  useMenu(menuProps, state, ref);

  return <div />
}

export function MenuItem() {

}
*/