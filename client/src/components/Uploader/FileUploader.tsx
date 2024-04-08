import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFileUpload from '../Inputs/InputFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import JSZip from 'jszip';

const FileUploader = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = (e.target as HTMLInputElement).files;

    console.log(files);

    if (files != null) {
      setSelectedFiles(files);
    }
  };

  //   async function sleep(ms: number): Promise<void> {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  const handleUpload = async (): Promise<void> => {
    setIsLoading(true);

    if (selectedFiles == null) {
      setIsLoading(false);
      setErrorMessage('Files were not chosen');
      return;
    }

    console.log(selectedFiles);
    const zip = new JSZip();
    Array.from(selectedFiles).forEach((file) => {
      zip.file(file.name, file, {
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });
    });

    console.log(zip);
    const content = await zip.generateAsync({ type: 'blob' });

    console.log(content);
    const formData = new FormData();
    formData.append('dicomFilesZip', content, 'dicom_files.zip');

    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/upload/testFolder`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        // navigate(`/annotations/${responseData.fileUUID}`);
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
          caption={`${selectedFiles === null ? 'Choose files' : 'Change files'}`}
          variant={`${selectedFiles === null ? 'contained' : 'outlined'}`}
          onChange={handleFileChange}
          accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
          id="files"
          name="files"
        />

        {selectedFiles !== null && (
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
