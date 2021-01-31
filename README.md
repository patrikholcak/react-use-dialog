# React Use Dialog

A set of headless React components that ease the implementation of dialogs. Completely unstyled components that allow you to pick your own styles and only implement the basic open/close behaviour.

## Example

```tsx
import { DialogStack, Dialog, useDialogs } from "react-use-dialog";

enum DialogKeys {
  myDialog,
}

function App() {
  const dialogs = useDialogs<DialogKeys>();

  const openDialog = () => dialogs.open(DialogKeys.myDialog);

  return (
    <>
      <button onClick={openDialog}>Open dialog</button>
      <Dialog id={DialogKeys.myDialog}>
        <div>Dialog content</div>
        <button onClick={dialogs.closeCurrent}>Close</button>
      </Dialog>
    </>
  );
}

ReactDOM.render(
  <DialogStack>
    <App />
  </DialogStack>,
  document.getElementById("root")
);
```

## Installation

1. `npm i react-use-dialog`

## Usage

1. Wrap your component (or App root) in a `<DialogStack>`. This provides the context for all other dialog children and the `useDialogs` hook.
1. Add a `<Dialog>`

## API

You can open dialogs through the `useDialogs` hook or by passing `isOpen` prop directly to Dialogs.

### Hooks

- `useDialogs<DialogKeys>`
  - `open(id: string | number)`: Open a dialog in the current stack.
  - `close(id: string | number)`: Close a dialog in the current stack.
  - `closeAll()`: Close all dialogs in the current stack.
  - `closeCurrent()`: Close the topmost dialog.
  - `closeAtIndex(index: number)`: Close all dialogs that have same or larger index.

### Components

- `<DialogStack />` - Context provider. You might want to have only one at the root of your app or multiple depending on your use-case.
  - `portalTarget?: Element = document.body` - An element to which the dialog will be rendered into. Defaults to body
- `<Dialog />`
  - `id: string | number`: Unique identifier in the current dialog stack.
  - `portalTarget?: Element = document.body` - An element to which the dialog will be rendered into. Overrides the stack target.
  - `isOpen?: boolean`: Allows to toggle the dialog state on outside state change, etc. You can also use `useDialogs().open(id: string)`
  - `closeOnEsc?: boolean = true`: Sets if dialog can be closed by pressing the ESC key.
  - `closeOnOverlayClick?: boolean = true`: Similarly to `closeOnEsc` you might want to disable a default behaviour of closing when user clicks the overlay.
  - `showOverlay?: boolean = true`: Set if the dialog will be rendered in an overlay. You will have to supply the overlay yourself if set to `false`.
  - `overlayProps?: OverlayProps`: Allows to pass custom properties to default overlay element. This is mainly for styling, but you can also pass `dataTestId` prop for test targetting purposes.
  - `onOpen?: Function`: Called when dialog state changes to open.
  - `onClose?: Function`: Called when dialog state changes to closed.
  - `onEscPress?: Function`: Called before `onClose` when user presses ESC on an escapable dialog.
  - `onOverlayClick?: Function`: Can be used in addition to `isOpen` to handle dialog state outside of the `DialogStack` context.
- `Overlay`
  - `dataTestId?: string`: Shorthand property for easier test targetting.
  - `…HTMLProps<HTMLDivElement>`
