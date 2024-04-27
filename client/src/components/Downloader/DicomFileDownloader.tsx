import * as React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import PropTypes from 'prop-types';

const DicomFileDownloader = ({ folderName, dicomFile }): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleDicomDownload = async (): Promise<void> => {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/folders/${folderName}/dicom/${dicomFile?.uuid}/download`,
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dicomFile?.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    handleClose();
  };

  const handleAnnotationDownload = async (): Promise<void> => {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations/${dicomFile?.uuid}/download`,
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}_${dicomFile?.uuid}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip title="Download">
        <IconButton
          color="primary"
          aria-label="download"
          size="large"
          aria-describedby={id}
          onClick={
            dicomFile?.lastAnnotaionDate === null
              ? () => {
                  void handleDicomDownload();
                }
              : handleClick
          }
        >
          <FileDownloadOutlinedIcon />
        </IconButton>
      </Tooltip>

      {dicomFile?.lastAnnotaionDate !== null && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <ButtonGroup
            orientation="vertical"
            variant="text"
            sx={{ textAlign: 'left', justifyItems: 'left' }}
          >
            <Button
              startIcon={<ImageOutlinedIcon />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => {
                void handleDicomDownload();
              }}
            >
              DICOM File
            </Button>
            <Button
              startIcon={<DrawOutlinedIcon />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => {
                void handleAnnotationDownload();
              }}
            >
              Annotation
            </Button>
          </ButtonGroup>
        </Popover>
      )}
    </>
  );
};

DicomFileDownloader.propTypes = {
  folderName: PropTypes.string,
  dicomFile: PropTypes.object,
};

export default DicomFileDownloader;
