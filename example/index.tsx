import * as React from "react";
import * as ReactDOM from "react-dom";

import { DialogStack, Dialog, useDialogs } from "../src";

enum DialogKeys {
  basic,
}

function StyledButton(props: any) {
  return (
    <button
      className="flex justify-center text-white bg-indigo-500 py-2 px-8 hover:bg-indigo-600 rounded text-lg"
      {...props}
    />
  );
}

function DialogOption({
  state,
  label,
}: {
  state: [boolean, Function];
  label: string;
}) {
  const [value, setValue] = state;

  return (
    <label>
      <input
        type="checkbox"
        defaultChecked={value}
        onChange={(ev) => setValue(ev.currentTarget.checked)}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}

function App() {
  const dialogs = useDialogs();
  const basicStyles = React.useState(true);
  const closeOnEsc = React.useState(true);
  const closeOnOverlay = React.useState(true);
  const showOverlay = React.useState(true);

  return (
    <div className="flex flex-col items-center pt-10">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
        React headless dialog
      </h1>
      <p className="mb-8 w-96">
        Example usage of the headless dialog component from{" "}
        <a
          href="http://github.com/patrikholcak/react-use-dialog"
          target="_blank"
          className="text-indigo-500"
        >
          react-use-dialog
        </a>
        . The component itself is completely unstyled and allows for custom
        styling. This example uses Tailwind.
      </p>

      <div className="grid grid-cols-1 w-96">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
          Basic options
        </h1>
        <DialogOption state={basicStyles} label="Enable example styles" />
        <DialogOption state={closeOnEsc} label="Close on ESC press" />
        <DialogOption state={closeOnOverlay} label="Close on overlay click" />
        <DialogOption state={showOverlay} label="Show overlay" />
      </div>

      <div className="flex mt-16">
        <StyledButton onClick={() => dialogs.open(DialogKeys.basic)}>
          Open dialog
        </StyledButton>
      </div>

      <Dialog
        id={DialogKeys.basic}
        closeOnEsc={closeOnEsc[0]}
        closeOnOverlayClick={closeOnOverlay[0]}
        showOverlay={showOverlay[0]}
        portalTarget={document.getElementById("dialogs")!}
        overlayProps={{
          className: basicStyles[0]
            ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            : undefined,
        }}
      >
        <div
          className={
            basicStyles[0]
              ? "bg-white py-6 px-8 w-2/5 rounded-md shadow"
              : undefined
          }
        >
          <h2
            className={
              basicStyles[0]
                ? "font-extrabold text-2xl text-gray-900 mb-4"
                : undefined
            }
          >
            Dialog title
          </h2>
          <div className={basicStyles[0] ? "mb-4" : undefined}>
            Dialog content…
          </div>
          <StyledButton onClick={dialogs.closeCurrent}>Close</StyledButton>
        </div>
      </Dialog>
    </div>
  );
}

ReactDOM.render(
  <DialogStack>
    <App />
  </DialogStack>,
  document.getElementById("root")
);
