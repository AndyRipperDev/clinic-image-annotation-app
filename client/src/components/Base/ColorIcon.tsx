import React from 'react';
import PropTypes from 'prop-types';
import PaletteIcon from '@mui/icons-material/Palette';

const ColorIcon = ({ colorName }): JSX.Element => {
  const getColor = (): string => {
    if (colorName === 'red') {
      return 'red';
    } else if (colorName === 'green') {
      return 'rgb(0, 255, 0)';
    } else if (colorName === 'blue') {
      return 'rgb(0, 115, 255)';
    } else if (colorName === 'purple') {
      return 'rgb(170, 0, 170)';
    } else if (colorName === 'pink') {
      return 'rgb(255, 0, 255)';
    } else if (colorName === 'turquoise') {
      return 'rgb(0, 255, 255)';
    } else if (colorName === 'orange') {
      return 'orange';
    } else if (colorName === 'yellow') {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  return <PaletteIcon sx={{ color: getColor }} />;
};

ColorIcon.propTypes = {
  colorName: PropTypes.string,
};

export default ColorIcon;
