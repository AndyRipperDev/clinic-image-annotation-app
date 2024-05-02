import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from 'prop-types';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';

const FolderConfigDownloader = ({ folderName }): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${folderName}/config/download`,
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}_config.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="outlined"
      color="primary"
      loading={isLoading}
      startIcon={<SimCardDownloadOutlinedIcon />}
      onClick={() => {
        void handleDownload();
      }}
    >
      Download Configuration
    </LoadingButton>
  );
};

FolderConfigDownloader.propTypes = {
  folderName: PropTypes.string,
};

export default FolderConfigDownloader;
