import * as React from "react";
import * as ReactDOM from "react-dom";
import * as renderer from "react-test-renderer";
import { DialogStack, Dialog, useDialogs } from ".";

const DIALOG_ID = "test-dialog";

describe("DialogStack", () => {
  beforeAll(() => {
    // @ts-expect-error
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
  });

  afterEach(() => {
    // @ts-expect-error
    ReactDOM.createPortal.mockClear();
  });

  it("renders", () => {
    const component = renderer.create(
      <DialogStack>
        <Dialog id={DIALOG_ID}>test</Dialog>
      </DialogStack>
    );

    expect(component.toJSON()).toMatchInlineSnapshot("null");
  });

  it("has state & opens dialog on state change", () => {
    let dialogState = {};
    let ref: any = null;

    function Content() {
      const dialogs = useDialogs();

      dialogState = dialogs.dialogState;

      return (
        <button ref={ref} id="btn" onClick={() => dialogs.open(DIALOG_ID)} />
      );
    }

    const component = renderer.create(
      <DialogStack>
        <Content />
        <Dialog id={DIALOG_ID}>test</Dialog>
      </DialogStack>
    );

    expect(dialogState).toStrictEqual({
      [DIALOG_ID]: { active: false, closeOnEsc: true, onEscPress: undefined },
    });

    const button: any = component.root.findByProps({ id: "btn" });

    renderer.act(() => button.props.onClick());

    expect(dialogState).toStrictEqual({
      [DIALOG_ID]: { active: true, closeOnEsc: true, onEscPress: undefined },
    });
  });
});
