import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const InputFileUpload = ({ caption, variant, onChange }): JSX.Element => {
  return (
    <Button
      component="label"
      role={undefined}
      variant={variant}
      tabIndex={-1}
      startIcon={<AttachFileIcon />}
    >
      {caption}
      <VisuallyHiddenInput type="file" onChange={onChange} />
    </Button>
  );
};

InputFileUpload.propTypes = {
  caption: PropTypes.string,
  variant: PropTypes.string,
  onChange: PropTypes.func,
};

export default InputFileUpload;
