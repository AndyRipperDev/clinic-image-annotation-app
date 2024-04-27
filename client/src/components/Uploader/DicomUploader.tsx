import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import JSZip from 'jszip';
import PropTypes from 'prop-types';
import FileUploadInput from '../Inputs/FileUploadInput';

const DicomUploader = ({ folderName, onError }): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    setIsLoading(true);

    const files = (e.target as HTMLInputElement).files;

    if (files === null) {
      setIsLoading(false);
      onError('Files were not chosen');
      return;
    }

    if (folderName === null) {
      setIsLoading(false);
      onError('Folder Name is empty');
      return;
    }

    const zip = new JSZip();
    Array.from(files).forEach((file) => {
      zip.file(file.name, file, {
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const formData = new FormData();
    formData.append('dicomFilesZip', content, 'dicom_files.zip');

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${folderName}/dicom`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        navigate(0);
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
          caption={isLoading ? 'Uploading...' : 'Add DICOM Files'}
          variant="outlined"
          onChange={handleUpload}
          loading={isLoading}
          accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
          id="files"
          name="files"
        />
      </Stack>
    </Stack>
  );
};

DicomUploader.propTypes = {
  folderName: PropTypes.string,
  onError: PropTypes.func,
};

export default DicomUploader;
