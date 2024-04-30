import * as React from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Box,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

const ColorSelector = ({ color, onChange }): JSX.Element => {
  const colors = ['red', 'green', 'blue', 'purple', 'orange', 'yellow'];

  return (
    <>
      <InputLabel id="annotationColorLabel">Color</InputLabel>
      <Select
        labelId="annotationColorLabel"
        id="annotationColor"
        name="annotationColor"
        value={color}
        label="Color *"
        onChange={onChange}
      >
        {colors.map((colorItem) => (
          <MenuItem key={colorItem} value={colorItem}>
            <Box
              display={'flex'}
              justifyItems={'center'}
              justifyContent={'center'}
            >
              <ListItemIcon>
                <PaletteIcon sx={{ color: colorItem }} />
              </ListItemIcon>
              <ListItemText>
                {colorItem.charAt(0).toUpperCase() + colorItem.slice(1)}
              </ListItemText>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

ColorSelector.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func,
};

export default ColorSelector;
