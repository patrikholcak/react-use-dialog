import * as React from "react";
import { DialogContext, DialogContextType, DialogIdentifier } from "./manager";

export type PublicDialogContext<DialogKeys extends DialogIdentifier> = Pick<
  DialogContextType<DialogKeys>,
  "open" | "close" | "closeAll" | "closeCurrent" | "closeAtIndex"
>;

/**
 * Returns hook that can be used to manipulate dialogs
 */
export function useDialogs<IdentifierType extends DialogIdentifier>() {
  const ctx: PublicDialogContext<IdentifierType> = React.useContext(
    DialogContext
  );

  return ctx;
}
