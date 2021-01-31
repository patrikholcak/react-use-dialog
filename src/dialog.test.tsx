import * as React from "react";
import * as ReactDOM from "react-dom";
import * as renderer from "react-test-renderer";
import { DialogContext, Dialog, DialogStack } from ".";

const DIALOG_ID = "test-dialog";
const contextValue = {
  dialogState: {},
  open: jest.fn(),
  close: jest.fn(),
  register: jest.fn(),
  unregister: jest.fn(),
  closeAll: jest.fn(),
  closeParent: jest.fn(),
  closeCurrent: jest.fn(),
};

describe("Dialog", () => {
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

  it("registers itself", () => {
    const component = renderer.create(
      <DialogContext.Provider value={contextValue}>
        <Dialog id={DIALOG_ID}>test</Dialog>
      </DialogContext.Provider>
    );

    expect(component.toJSON()).toMatchInlineSnapshot("null");

    renderer.act(() => component.unmount());

    expect(contextValue.register).toHaveBeenCalledWith(
      DIALOG_ID,
      true,
      undefined
    );
    expect(contextValue.unregister).toHaveBeenCalledWith(DIALOG_ID);
  });

  it("renders content", () => {
    const component = renderer.create(
      <DialogStack>
        <Dialog id={DIALOG_ID} isOpen={true}>
          test
        </Dialog>
      </DialogStack>
    );

    // We want to check if the component is null first
    expect(component.toJSON()).toStrictEqual(null);
    renderer.act(() => {});

    expect(component.toJSON()).toMatchInlineSnapshot(`
      <div
        onClick={[Function]}
      >
        test
      </div>
      `);

    renderer.act(() => {
      component.update(
        <DialogStack>
          <Dialog id={DIALOG_ID} isOpen={false}>
            test
          </Dialog>
        </DialogStack>
      );
    });

    expect(component.toJSON()).toStrictEqual(null);
  });

  it("handles overlay click correctly", () => {
    const onOverlayClick = jest.fn();

    let component: any;
    renderer.act(() => {
      component = renderer.create(
        <DialogStack>
          <Dialog
            id={DIALOG_ID}
            isOpen={true}
            onOverlayClick={onOverlayClick}
            overlayProps={{ dataTestId: "overlay" }}
          >
            test
          </Dialog>
        </DialogStack>
      );
    });

    const overlay: any = component.root.findByProps({
      "data-testid": "overlay",
    });

    renderer.act(() => overlay.props.onClick({}));

    expect(onOverlayClick).toHaveBeenCalled();
  });

  it("doesn’t call onOverlayClick when disabled", () => {
    const onOverlayClick = jest.fn();

    let component: any;
    renderer.act(() => {
      component = renderer.create(
        <DialogStack>
          <Dialog
            id={DIALOG_ID}
            isOpen={true}
            closeOnOverlayClick={false}
            onOverlayClick={onOverlayClick}
            overlayProps={{ dataTestId: "overlay" }}
          >
            test
          </Dialog>
        </DialogStack>
      );
    });

    const overlay: any = component.root.findByProps({
      "data-testid": "overlay",
    });

    renderer.act(() => overlay.props.onClick({}));

    expect(onOverlayClick).not.toHaveBeenCalled();
  });

  it("renders without overlay", () => {
    let component: any;

    renderer.act(() => {
      component = renderer.create(
        <DialogStack>
          <Dialog
            id={DIALOG_ID}
            isOpen={true}
            showOverlay={false}
            overlayProps={{ dataTestId: "overlay" }}
          >
            test
          </Dialog>
        </DialogStack>
      );
    });

    function getOverlay() {
      return component.root.findByProps({
        "data-testid": "overlay",
      });
    }

    expect(getOverlay).toThrow();
  });

  it("has lifecycle methods", () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    let component: any;

    renderer.act(() => {
      component = renderer.create(
        <DialogStack>
          <Dialog
            id={DIALOG_ID}
            isOpen={true}
            onOpen={onOpen}
            onClose={onClose}
          >
            test
          </Dialog>
        </DialogStack>
      );
    });

    renderer.act(() => {
      component.update(
        <DialogStack>
          <Dialog
            id={DIALOG_ID}
            isOpen={false}
            onOpen={onOpen}
            onClose={onClose}
          >
            test
          </Dialog>
        </DialogStack>
      );
    });

    expect(onOpen).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
