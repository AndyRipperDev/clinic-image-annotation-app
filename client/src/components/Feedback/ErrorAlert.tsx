import * as React from 'react';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const ErrorAlert = ({
  text,
  widthPercent = 50,
  marginTop = 10,
}): JSX.Element => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: marginTop }}>
      <Alert
        sx={{ width: `${widthPercent}%` }}
        variant="outlined"
        severity="error"
      >
        {text}
      </Alert>
    </Box>
  );
};

ErrorAlert.propTypes = {
  text: PropTypes.string,
  widthPercent: PropTypes.number,
  marginTop: PropTypes.number,
};

export default ErrorAlert;
