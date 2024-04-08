import React from 'react';
import { Stack } from '@mui/material';
import FileUploader from '../../components/Uploader/FileUploader';
import Title from '../../components/Base/Title';
import Paragraph from '../../components/Base/Paragraph';

const FoldersPage = (): JSX.Element => {
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
        <Paragraph
          text={'Choose file and then upload it'}
          maxWidth={'sm'}
          mx={0}
          textAlign={'center'}
        />

        <FileUploader />
      </Stack>
    </div>
  );
};

export default FoldersPage;
