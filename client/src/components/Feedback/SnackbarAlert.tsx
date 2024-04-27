import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const SnackbarAlert = ({
  open,
  setOpen,
  text,
  duration = 5000,
}): JSX.Element => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ): void => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      sx={{ width: '25%' }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={'success'}
        // variant="outlined"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

SnackbarAlert.propTypes = {
  text: PropTypes.string,
  duration: PropTypes.number,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default SnackbarAlert;
