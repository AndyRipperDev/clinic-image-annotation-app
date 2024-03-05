import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFileUpload from '../Inputs/InputFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const FileUploader = (): JSX.Element => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = (e.target as HTMLInputElement).files;
    const file = files?.[0];

    if (file != null) {
      setUploadFile(file);
    }
  };

  //   async function sleep(ms: number): Promise<void> {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  const handleUpload = async (): Promise<void> => {
    setIsLoading(true);

    if (uploadFile == null) {
      setIsLoading(false);
      setErrorMessage('File was not chosen');
      return;
    }

    const formData = new FormData();
    formData.append('uploaded_file', uploadFile);

    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('fileUUID', JSON.stringify(responseData.fileUUID));
        navigate('/editor');
      } else {
        setErrorMessage('File upload failed');
      }
    } catch (error) {
      setErrorMessage(`Error uploading file: ${error}`);
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
        <InputFileUpload
          caption={`${uploadFile === null ? 'Choose file' : 'Change file'}`}
          variant={`${uploadFile === null ? 'contained' : 'outlined'}`}
          onChange={handleFileChange}
        />

        {uploadFile !== null && (
          <LoadingButton
            onClick={() => {
              void handleUpload();
            }}
            loading={isLoading}
            loadingPosition="start"
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </LoadingButton>
        )}
      </Stack>
      {errorMessage !== null && <Alert severity="error">{errorMessage}</Alert>}
    </Stack>
  );
};

export default FileUploader;
