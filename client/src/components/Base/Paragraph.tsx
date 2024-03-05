import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const Paragraph = ({ text, maxWidth, mx, textAlign }): JSX.Element => {
  return (
    <Typography
      sx={{
        maxWidth,
        mx,
        textAlign,
        py: 3,
        color: '#7b7b7b',
      }}
    >
      {text}
    </Typography>
  );
};

Paragraph.propTypes = {
  text: PropTypes.string,
  maxWidth: PropTypes.string,
  mx: PropTypes.number,
  textAlign: PropTypes.string,
};

export default Paragraph;
