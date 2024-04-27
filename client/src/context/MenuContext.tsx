import * as React from 'react';
import {
  type IContextMenuButtons,
  //   type IContextMenuButton,
} from '../interfaces/menuContext';

// export const MenuContext = React.createContext<{
//   menuButtons: IMenuContext | null;
//   setMenuButtons: React.Dispatch<React.SetStateAction<IMenuContext | null>>;
// } | null>(null);

export const MenuContext = React.createContext<{
  menuButtons: IContextMenuButtons | null;
  setMenuButtons: React.Dispatch<
    React.SetStateAction<IContextMenuButtons | null>
  >;
} | null>(null);

// export const MenuContext = React.createContext({
//   buttonNames: [],
//   setButtonNames: () => {},
//   buttonHandlers: [],
//   setButtonHandlers: () => {},
// });
