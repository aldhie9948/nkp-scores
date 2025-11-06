import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { ReactNode } from 'react';
export default function OverlayScroll({ children }: { children?: ReactNode }) {
  return (
    <OverlayScrollbarsComponent
      className="grow"
      options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 200 } }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
