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
import ColorIcon from '../Base/ColorIcon';

const ColorSelector = ({ color, onChange }): JSX.Element => {
  const colors = [
    'red',
    'green',
    'blue',
    'purple',
    'pink',
    'turquoise',
    'orange',
    'yellow',
  ];

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
                <ColorIcon colorName={colorItem} />
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
