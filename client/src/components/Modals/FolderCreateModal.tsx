import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';

const FolderCreateModal = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setErrorMessage(null);
  };

  const handlePost = async (folderName: string): Promise<void> => {
    setIsLoading(true);

    if (folderName === '') {
      setIsLoading(false);
      setErrorMessage('Folder Name is required');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('folderName', folderName);

    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/folders/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        navigate(`/folders/${responseData.name}`);
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
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<CreateNewFolderIcon />}
      >
        Create Folder
      </Button>
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
            await handlePost(formJson.folderName as string);
          },
        }}
      >
        <DialogTitle>Create New Folder</DialogTitle>

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
            id="folderName"
            name="folderName"
            label="Folder Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton type="submit" loading={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default FolderCreateModal;
