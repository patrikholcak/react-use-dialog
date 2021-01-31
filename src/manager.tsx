import * as React from "react";

export type DialogIdentifier = string | number;

export interface DialogContextType<
  DialogKeys extends DialogIdentifier = DialogIdentifier
> {
  dialogState: Record<DialogKeys, DialogState>;
  portalTarget: Element;
  currentDialog?: DialogIdentifier;
  open: (id: DialogKeys) => void;
  close: (id: DialogKeys) => void;
  register: (
    id: DialogKeys,
    closeOnEsc?: boolean,
    onEscPress?: () => any
  ) => void;
  unregister: (id: DialogKeys) => void;
  closeAll: () => void;
  closeCurrent: () => void;
  closeAtIndex: (index: number) => void;
}

export const DialogContext = React.createContext<DialogContextType>({
  dialogState: {},
  portalTarget: globalThis.document.body,
  currentDialog: undefined,
  open: () => {},
  close: () => {},
  register: () => {},
  unregister: () => {},
  closeAll: () => {},
  closeCurrent: () => {},
  closeAtIndex: () => {},
});

interface DialogStackProps {
  /**
   * Sets the element into which the dialogs will be rendered. This setting can
   * be overriden by each dialog.
   *
   * @default document.body
   */
  portalTarget?: Element;

  children: React.ReactNode;
}

interface DialogState {
  active: boolean;
  closeOnEsc?: boolean;
  onEscPress?: () => any;
}

/**
 * Creates context for dialogs.
 */
export function DialogStack({
  portalTarget = globalThis.document?.body,
  children,
}: DialogStackProps) {
  const [dialogState, setDialogState] = React.useState<
    Record<string, DialogState>
  >({});

  /**
   * Keep track of all the open dialogs in the stack so we can close them all,
   * close at index or keep track of the topmost one.
   */
  const [openDialogs, setOpenDialogs] = React.useState<DialogIdentifier[]>([]);
  const currentDialog = React.useMemo(
    () => openDialogs[openDialogs.length - 1],
    [openDialogs]
  );

  const { current: register } = React.useRef(
    (id: DialogIdentifier, closeOnEsc?: boolean, onEscPress?: () => any) => {
      setDialogState((state) => ({
        ...state,
        [id]: { active: false, closeOnEsc, onEscPress },
      }));
    }
  );

  const { current: open } = React.useRef((id: DialogIdentifier) => {
    setDialogState((state) => ({
      ...state,
      [id]: { ...state[id], active: true },
    }));
    setOpenDialogs((state) => [...state, id]);
  });

  const { current: close } = React.useRef((id: DialogIdentifier) => {
    setDialogState((state) => ({
      ...state,
      [id]: { ...state[id], active: false },
    }));
    setOpenDialogs((state) => state.filter((dialog) => dialog !== id));
  });

  const { current: unregister } = React.useRef((id: DialogIdentifier) =>
    setDialogState((state) => {
      const newState = { ...state };

      delete newState[id];

      return newState;
    })
  );

  const { current: closeAll } = React.useRef(() => {
    setDialogState((state) => {
      const stateEntries = Object.entries(state).map(
        ([key]) =>
          [key, { ...state[key], active: false }] as [string, DialogState]
      );

      return Object.fromEntries(stateEntries);
    });
    setOpenDialogs([]);
  });

  const closeCurrent = React.useCallback(() => {
    close(currentDialog);
  }, [currentDialog]);

  const closeAtIndex = React.useCallback(
    (index: number) => {
      const dialogsToClose = openDialogs.slice(index);
      const remainingDialogs = openDialogs.slice(0, index);

      setOpenDialogs(remainingDialogs);
      setDialogState((state) => {
        const newState = { ...state };

        for (const key of dialogsToClose) {
          newState[key] = { ...newState[key], active: false };
        }

        return newState;
      });
    },
    [openDialogs]
  );

  /**
   * Pressing ESC should close the topmost dialog.
   */
  React.useEffect(() => {
    if (!dialogState[currentDialog]?.closeOnEsc) return;

    function handleEscPress(ev: KeyboardEvent) {
      if (ev.key !== "Escape") return;

      dialogState[currentDialog].onEscPress?.();
      close(currentDialog);
    }

    document.addEventListener("keyup", handleEscPress);

    return () => {
      document.removeEventListener("keyup", handleEscPress);
    };
  }, [dialogState, currentDialog]);

  return (
    <DialogContext.Provider
      value={{
        portalTarget,
        dialogState,
        currentDialog,
        open,
        close,
        register,
        unregister,
        closeAll,
        closeCurrent,
        closeAtIndex,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}
