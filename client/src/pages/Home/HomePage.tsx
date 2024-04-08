import React from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';
// import FileUploader from '../../components/Uploader/FileUploader';
import Title from '../../components/Base/Title';
import Paragraph from '../../components/Base/Paragraph';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { Link } from 'react-router-dom';

const HomePage = (): JSX.Element => {
  return (
    <div>
      <Stack
        component="section"
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          py: 10,
          mx: 6,
        }}
      >
        <Title text={'Image Annotation'} textAlign={'center'} />
        {/* <Paragraph
          text={'Choose file and then upload it'}
          maxWidth={'sm'}
          mx={0}
          textAlign={'center'}
        /> */}
        <Paragraph
          text={
            'Create new folder with DICOM images or show already created folders'
          }
          maxWidth={'sm'}
          mx={0}
          textAlign={'center'}
        />

        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button
            component={Link}
            to="/folders/new"
            startIcon={<CreateNewFolderIcon />}
          >
            Create Folder
          </Button>
          <Button component={Link} to="/folders" startIcon={<FolderIcon />}>
            Show Folders
          </Button>
        </ButtonGroup>

        {/* <FileUploader /> */}
      </Stack>
    </div>
  );
};

export default HomePage;
