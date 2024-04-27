import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from 'prop-types';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';

const FolderDownloader = ({ folderName, smallButton = false }): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${folderName}/download`,
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {smallButton ? (
        <>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Tooltip title="Download">
              <IconButton
                color="primary"
                aria-label="download"
                size="large"
                onClick={() => {
                  void handleDownload();
                }}
              >
                <FileDownloadOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <LoadingButton
          variant="outlined"
          color="primary"
          loading={isLoading}
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={() => {
            void handleDownload();
          }}
        >
          Download
        </LoadingButton>
      )}
    </>
  );
};

FolderDownloader.propTypes = {
  folderName: PropTypes.string,
  smallButton: PropTypes.bool,
};

export default FolderDownloader;
