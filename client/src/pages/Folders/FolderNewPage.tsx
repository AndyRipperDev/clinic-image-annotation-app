import React, { useState } from 'react';
import { TextField } from '@mui/material';
import Paragraph from '../../components/Base/Paragraph';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputFileUpload from '../../components/Inputs/InputFileUpload';

const FolderNewPage = (): JSX.Element => {
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = (e.target as HTMLInputElement).files;

    console.log(files);

    if (files != null) {
      setUploadFiles(files);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      folderName: data.get('folderName'),
      files: data.get('files'),
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create New Folder
        </Typography>
        <Paragraph
          text={'Enter folder name, choose DICOM files and save it'}
          maxWidth={'sm'}
          mx={0}
          textAlign={'center'}
        />
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="folderName"
            label="Folder Name"
            name="folderName"
            autoFocus
            sx={{ mb: 2 }}
          />
          <InputFileUpload
            caption={`${uploadFiles === null ? 'Choose files' : 'Change files'}`}
            variant={`${uploadFiles === null ? 'contained' : 'outlined'}`}
            accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
            id="files"
            name="files"
            onChange={handleFilesChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FolderNewPage;
