import * as React from "react";

export interface OverlayProps extends React.HTMLProps<HTMLDivElement> {
  dataTestId?: string;
}

export function Overlay({ dataTestId, ...props }: OverlayProps) {
  return (
    <div data-testid={dataTestId} {...props}>
      {props.children}
    </div>
  );
}
