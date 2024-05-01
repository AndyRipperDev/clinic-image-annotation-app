import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';
import Title from '../../components/Base/Title';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DicomFileInfoDataTable from '../../components/DataTable/DicomFileInfoDataTable';
import DicomUploader from '../../components/Uploader/DicomUploader';
import FolderEditModal from '../../components/Modals/FolderEditModal';
import type IFolder from '../../interfaces/folder';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderDownloader from '../../components/Downloader/FolderDownloader';
import InfoAlert from '../../components/Feedback/InfoAlert';
import ErrorAlert from '../../components/Feedback/ErrorAlert';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import CircularLoading from '../../components/Loadings/CircularLoading';
import FolderConfigDownloader from '../../components/Downloader/FolderConfigDownloader';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

const FoldersDetailPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasConfig, setHasConfig] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      setIsLoading(true);

      void fetch(
        `${process.env.BACKEND_API_URL}/folders/${params.folderName}/config`,
      )
        .then(async (response) => {
          if (response.status === 200) {
            setHasConfig(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      ignore = true;
    };
  }, []);

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

  if (params.folderName === null) {
    navigate('/');
  }

  return (
    <div>
      {isLoading ? (
        <CircularLoading />
      ) : (
        <>
          <Title text={params.folderName} textAlign={'left'} />
          {errorMessage !== null && (
            <ErrorAlert text={errorMessage} marginTop={4} />
          )}
          <Stack
            component="section"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              pt: 6,
              pb: 2,
            }}
          >
            <ButtonGroup variant="outlined">
              {hasConfig ? (
                <DicomUploader
                  folderName={params.folderName}
                  onError={handleUploadError}
                />
              ) : (
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/folders/${params.folderName}/config`}
                  startIcon={<PostAddOutlinedIcon />}
                >
                  Add Configuration
                </Button>
              )}
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
            </ButtonGroup>
            {hasConfig && (
              <ButtonGroup variant="outlined">
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/folders/${params.folderName}/config`}
                  startIcon={<DocumentScannerOutlinedIcon />}
                >
                  Show Configuration
                </Button>
                <FolderConfigDownloader folderName={params.folderName} />
                <FolderDownloader folderName={params.folderName} />
              </ButtonGroup>
            )}
          </Stack>

          {hasConfig ? (
            <DicomFileInfoDataTable folderName={params.folderName} />
          ) : (
            <InfoAlert
              text={
                "There's no folder configuration yet. Please configure this folder via Add configuration button."
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default FoldersDetailPage;
