import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const FolderEditModal = ({
  folderNameOriginal,
  onRename,
  labeledButton = false,
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setErrorMessage(null);
  };

  const handlePost = async (newFolderName: string): Promise<void> => {
    setIsLoading(true);

    if (newFolderName === '') {
      setIsLoading(false);
      setErrorMessage('Folder Name is required');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('newFolderName', newFolderName);

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${folderNameOriginal}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();

        onRename(folderNameOriginal, responseData);
        handleClose();
      } else {
        const responseData = await response.json();
        setErrorMessage(responseData.error as string);
      }
    } catch (error) {
      setErrorMessage(error.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {labeledButton ? (
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          startIcon={<DriveFileRenameOutlineIcon />}
        >
          Rename
        </Button>
      ) : (
        <Tooltip title="Rename">
          <IconButton
            color="primary"
            aria-label="rename"
            size="large"
            onClick={handleClickOpen}
          >
            <DriveFileRenameOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
            const formJson = Object.fromEntries((formData as any).entries());
            await handlePost(formJson.newFolderName as string);
          },
        }}
      >
        <DialogTitle>Rename Folder</DialogTitle>

        {errorMessage !== null && (
          <Box sx={{ paddingX: 3 }}>
            <Alert variant="outlined" severity="error">
              {errorMessage}
            </Alert>
          </Box>
        )}
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="newFolderName"
            name="newFolderName"
            label="Folder Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={folderNameOriginal}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton type="submit" loading={isLoading}>
            {isLoading ? 'Renaming...' : 'Rename'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

FolderEditModal.propTypes = {
  folderNameOriginal: PropTypes.string,
  onRename: PropTypes.func,
  labeledButton: PropTypes.bool,
};

export default FolderEditModal;
