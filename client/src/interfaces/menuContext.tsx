// import type React from 'react';
import { type ReactNode } from 'react';

export interface IContextMenuButton {
  name: string;
  handler: () => void;
  icon: ReactNode;
}

export interface IContextMenuButtons {
  buttons: IContextMenuButton[];
  drawingTools: IContextMenuButton[];
  drawingToolList: ReactNode;
}

// export interface IMenuContext {
//   buttonNames: string[];
//   buttonFunctions: [];
//   buttonIcons: [];
// }
