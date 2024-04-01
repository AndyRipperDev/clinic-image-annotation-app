import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { Link } from 'react-router-dom';

export const mainMenuItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/annotations/e460d91b-b54d-4c5f-89b4-8115c69868de"
    >
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary="Folders" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryMenuItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Actions
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <CreateNewFolderIcon />
      </ListItemIcon>
      <ListItemText primary="New folder" />
    </ListItemButton>
  </React.Fragment>
);
