import * as React from "react";
import * as ReactDOM from "react-dom";
import { DialogContext, DialogIdentifier } from "./manager";
import { Overlay, OverlayProps } from "./overlay";

export interface DialogProps {
  /**
   * Unique identifier in the current dialog stack.
   */
  id: DialogIdentifier;

  /**
   * Open/close the dialog. Allows to toggle the dialog state on outside state
   * change, etc.
   */
  isOpen?: boolean;

  /**
   * Called when dialog state changes to open.
   */
  onOpen?: () => any;

  /**
   * Called when dialog state changes to closed.
   */
  onClose?: () => any;

  /**
   * Sets if dialog can be closed by pressing the ESC key.
   *
   * @default true
   */
  closeOnEsc?: boolean;

  /**
   * Action that happens when user presses ESC on an escapable dialog.
   */
  onEscPress?: () => any;

  /**
   * Disable closing on overlay click.
   *
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Can be used in addition to `isOpen` to handle dialog state outside of the
   * `DialogStack` context.
   */
  onOverlayClick?: () => void;

  /**
   * Sets if the dialog will be rendered in an overlay. You will have to supply
   * the overlay yourself if set to `false` as the element will be appended to
   * body.
   *
   * @default true
   */
  showOverlay?: boolean;

  /**
   * Any additional props to the overlay. Does not take effect if `showOverlay`
   * is `false`
   */
  overlayProps?: OverlayProps;

  /**
   * Sets the element into which the dialog will be rendered. Overrides the stack
   * target.
   *
   * @default document.body
   */
  portalTarget?: Element;

  children: React.ReactNode;
}

/**
 * Dialog component that wraps any content that is displayed as dialog.
 * This component creates its own DialogStack for its children.
 */
export function Dialog(props: DialogProps) {
  const {
    showOverlay = true,
    closeOnEsc = true,
    closeOnOverlayClick = true,
  } = props;
  const ctx = React.useContext(DialogContext);
  const isDialogOpen = ctx.dialogState[props.id]?.active;
  const hasDialogOpen = React.useRef(false);
  const dialogTarget = props.portalTarget ?? ctx.portalTarget;

  /**
   * Register the dialog in the parent DialogStack
   */
  React.useEffect(() => {
    ctx.register(props.id, closeOnEsc, props.onEscPress);

    return () => {
      ctx.unregister(props.id);
    };
  }, [props.id, closeOnEsc]);

  /**
   * Handle lifecycle methods
   */
  React.useEffect(() => {
    if (isDialogOpen) {
      props.onOpen?.();
      hasDialogOpen.current = true;
      return;
    }

    if (!hasDialogOpen.current) return;

    props.onClose?.();
  }, [isDialogOpen]);

  /**
   * Handle `isOpen` prop
   */
  React.useEffect(() => {
    if (props.isOpen) {
      ctx.open(props.id);
      return;
    }

    if (!hasDialogOpen.current) return;

    ctx.close(props.id);
  }, [props.isOpen]);

  const onOverlayClick = React.useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (closeOnOverlayClick && ev.target === ev.currentTarget) {
        props.onOverlayClick?.();
        ctx.close(props.id);
      }
    },
    [closeOnOverlayClick]
  );

  if (!isDialogOpen || !(globalThis ?? {}).document) return null;

  if (showOverlay) {
    return ReactDOM.createPortal(
      <Overlay onClick={onOverlayClick} {...props.overlayProps}>
        {props.children}
      </Overlay>,
      dialogTarget
    );
  }

  return ReactDOM.createPortal(props.children, dialogTarget);
}
