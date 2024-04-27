import React, { useState } from 'react';
import { Alert, Box, Button, ButtonGroup, Stack } from '@mui/material';
import Title from '../../components/Base/Title';
import { useNavigate, useParams } from 'react-router-dom';
import DicomFileInfoDataTable from '../../components/DataTable/DicomFileInfoDataTable';
import DicomUploader from '../../components/Uploader/DicomUploader';
import FolderEditModal from '../../components/Modals/FolderEditModal';
import type IFolder from '../../interfaces/folder';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderDownloader from '../../components/Downloader/FolderDownloader';

const FoldersDetailPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (params.folderName === null) {
    navigate('/');
  }

  const handleFolderRename = (
    oldName: string,
    updatedFolder: IFolder,
  ): void => {
    navigate(`/folders/${updatedFolder.name}`);
  };

  const handleUploadError = (error: string): void => {
    setErrorMessage(error);
  };

  const deleteAction = async (): Promise<void> => {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/folders/${params.folderName}`,
      {
        method: 'DELETE',
      },
    );

    if (response.ok) {
      navigate('/folders');
    } else {
      const data = await response.json();
      setErrorMessage(data?.error as string);
    }
  };

  return (
    <div>
      <Title text={params.folderName} textAlign={'left'} />
      {errorMessage !== null && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Alert sx={{ width: '50%' }} variant="outlined" severity="error">
            {errorMessage}
          </Alert>
        </Box>
      )}
      <Stack
        component="section"
        direction="row"
        justifyContent="left"
        alignItems="center"
        sx={{
          pt: 6,
          pb: 2,
        }}
      >
        <ButtonGroup variant="outlined">
          <DicomUploader
            folderName={params.folderName}
            onError={handleUploadError}
          />
          <FolderEditModal
            folderNameOriginal={params.folderName}
            onRename={handleFolderRename}
            labeledButton={true}
          />
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => {
              void deleteAction();
            }}
          >
            Delete
          </Button>
          <FolderDownloader folderName={params.folderName} />
        </ButtonGroup>
      </Stack>

      <DicomFileInfoDataTable folderName={params.folderName} />
    </div>
  );
};

export default FoldersDetailPage;
