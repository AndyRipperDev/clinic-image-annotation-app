import * as React from 'react';
import { type IContextMenuButtons } from '../interfaces/menuContext';

export const MenuContext = React.createContext<{
  menuButtons: IContextMenuButtons | null;
  setMenuButtons: React.Dispatch<
    React.SetStateAction<IContextMenuButtons | null>
  >;
} | null>(null);
