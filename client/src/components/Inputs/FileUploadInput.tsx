import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LoadingButton from '@mui/lab/LoadingButton';

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

const FileUploadInput = ({
  id,
  name,
  accept,
  caption,
  variant,
  onChange,
  loading,
  multiple = true,
}): JSX.Element => {
  return (
    <LoadingButton
      component="label"
      role={undefined}
      variant={variant}
      loading={loading}
      tabIndex={-1}
      startIcon={<AttachFileIcon />}
    >
      {caption}
      <VisuallyHiddenInput
        id={id}
        name={name}
        accept={accept}
        type="file"
        multiple={multiple}
        onChange={onChange}
      />
    </LoadingButton>
  );
};

FileUploadInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  accept: PropTypes.string,
  caption: PropTypes.string,
  variant: PropTypes.string,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  multiple: PropTypes.bool,
};

export default FileUploadInput;
