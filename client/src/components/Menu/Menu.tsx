import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainMenuItems } from './MenuItems';
import { Outlet } from 'react-router-dom';
import { MenuContext } from '../../context/MenuContext';
import { ListSubheader, Tooltip } from '@mui/material';
import { type IContextMenuButtons } from '../../interfaces/menuContext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!(open ?? false) && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Menu(): JSX.Element {
  const [open, setOpen] = React.useState(true);
  const [menuButtons, setMenuButtons] =
    React.useState<IContextMenuButtons | null>(null);
  const value = { menuButtons, setMenuButtons };

  console.log(menuButtons);

  const toggleDrawer = (): void => {
    setOpen(!open);
  };

  return (
    <MenuContext.Provider value={value}>
      <Box sx={{ display: 'flex', padding: 0, height: '100vh' }}>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton onClick={toggleDrawer}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainMenuItems}
            {menuButtons !== null && (
              <>
                {menuButtons?.drawingToolList !== null && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    {open && (
                      <ListSubheader
                        component="div"
                        inset
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        Drawing Tools
                        <Tooltip title="Hold 'Shift' key to annotate, then click to the image to confirm annotation">
                          <InfoOutlinedIcon sx={{ fontSize: 18, mx: 1.5 }} />
                        </Tooltip>
                      </ListSubheader>
                    )}

                    {menuButtons?.drawingToolList}
                  </>
                )}
                {menuButtons?.optionList !== null && (
                  <>
                    <Divider sx={{ my: 1 }} />

                    {open && (
                      <ListSubheader component="div" inset>
                        Options
                      </ListSubheader>
                    )}

                    {menuButtons?.optionList}
                  </>
                )}
              </>
            )}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Box
            sx={
              menuButtons === null ? { mt: 2, mb: 4, mr: 4, ml: 4 } : { m: 0 }
            }
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </MenuContext.Provider>
  );
}
