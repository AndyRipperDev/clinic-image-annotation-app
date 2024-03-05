import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ text, textAlign }): JSX.Element => {
  return (
    <Typography
      variant="h4"
      component="h3"
      sx={{
        fontWeight: '700',
        textAlign,
      }}
    >
      {text}
    </Typography>
  );
};

Title.propTypes = {
  text: PropTypes.string,
  textAlign: PropTypes.string,
};

export default Title;
