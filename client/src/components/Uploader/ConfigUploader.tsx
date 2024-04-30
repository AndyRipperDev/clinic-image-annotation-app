import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import FileUploadInput from '../Inputs/FileUploadInput';

const ConfigUploader = ({ folderName, onError }): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    setIsLoading(true);

    const files = (e.target as HTMLInputElement).files;
    const file = files?.[0];

    if (file === null || file === undefined) {
      setIsLoading(false);
      onError('File not chosen');
      return;
    }

    if (folderName === null) {
      setIsLoading(false);
      onError('Folder Name is empty');
      return;
    }

    const formData = new FormData();
    formData.append('config', file);

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${folderName}/config/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        navigate(`/folders/${folderName}`);
      } else {
        const responseData = await response.json();
        onError(responseData?.error as string);
      }
    } catch (error) {
      onError(error.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={4} justifyContent="center" alignItems="center">
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <FileUploadInput
          caption={isLoading ? 'Importing...' : 'Import Configuration'}
          variant="outlined"
          onChange={handleUpload}
          loading={isLoading}
          accept="application/json"
          id="config"
          name="config"
          multiple={false}
        />
      </Stack>
    </Stack>
  );
};

ConfigUploader.propTypes = {
  folderName: PropTypes.string,
  onError: PropTypes.func,
};

export default ConfigUploader;
