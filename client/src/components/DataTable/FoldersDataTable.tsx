import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  type GridRowParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import CircularLoading from '../Loadings/CircularLoading';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FolderEditModal from '../Modals/FolderEditModal';
import type IFolder from '../../interfaces/folder';
import FolderDownloader from '../Downloader/FolderDownloader';
import ErrorAlert from '../Feedback/ErrorAlert';
import InfoAlert from '../Feedback/InfoAlert';

const fetchFolders = async (): Promise<IFolder[]> => {
  const response = await fetch(`${process.env.BACKEND_API_URL}/folders/`);
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw data?.error;
  }
};

const FoldersDataTable = (): JSX.Element => {
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const redirectAction = (row): void => {
    navigate(`/folders/${row.name}`);
  };

  const handleFolderRename = (
    oldName: string,
    updatedFolder: IFolder,
  ): void => {
    setFolders(
      folders.map((folder) =>
        folder.name === oldName ? updatedFolder : folder,
      ),
    );
  };

  const deleteAction = async (row): Promise<void> => {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/folders/${row.name}`,
      {
        method: 'DELETE',
      },
    );

    if (response.ok) {
      setFolders(folders.filter((folder) => folder.name !== row.name));
    } else {
      const data = await response.json();
      setErrorMessage(data?.error as string);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 600 },
    {
      field: 'created',
      headerName: 'Created',
      type: 'dateTime',
      width: 200,
      valueGetter: (value) => value && new Date(value),
      valueFormatter: (value?: Date) => {
        if (value == null) {
          return '';
        }

        const dateOptions: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        };

        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };

        const formattedDate = value.toLocaleDateString('cs-CZ', dateOptions);
        const formattedTime = value.toLocaleTimeString('cs-CZ', timeOptions);

        return `${formattedDate}, ${formattedTime}`;
      },
    },
    {
      field: 'changed',
      headerName: 'Changed',
      type: 'dateTime',
      width: 200,
      valueGetter: (value) => value && new Date(value),
      valueFormatter: (value?: Date) => {
        if (value == null) {
          return '';
        }

        const dateOptions: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        };

        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };

        const formattedDate = value.toLocaleDateString('cs-CZ', dateOptions);
        const formattedTime = value.toLocaleTimeString('cs-CZ', timeOptions);

        return `${formattedDate}, ${formattedTime}`;
      },
    },
    {
      field: 'dicomFilesCount',
      headerName: 'DICOM Count',
      type: 'number',
      width: 180,
    },
    {
      field: 'action',
      headerName: 'Options',
      sortable: false,
      width: 250,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="View">
            <IconButton
              color="primary"
              aria-label="view"
              size="large"
              onClick={() => {
                redirectAction(row);
              }}
            >
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
          <FolderEditModal
            folderNameOriginal={row.name}
            onRename={handleFolderRename}
            labeledButton={false}
          />
          <Tooltip title="Delete">
            <IconButton
              color="primary"
              aria-label="delete"
              size="large"
              onClick={() => {
                void deleteAction(row);
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>

          <FolderDownloader folderName={row.name} smallButton={true} />
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        setIsLoading(true);
        const data = await fetchFolders();
        setFolders(data);
      } catch (error) {
        setErrorMessage(error.message as string);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (errorMessage !== null) {
    return <ErrorAlert text={errorMessage} />;
  }

  return (
    <div style={{ width: '100%' }}>
      {isLoading ? (
        <CircularLoading />
      ) : (
        <>
          {folders.length === 0 ? (
            <InfoAlert
              text={
                'There are no folders yet. Create new folder via Create Folder button.'
              }
            />
          ) : (
            <DataGrid
              getRowId={(row) => row.name}
              rows={folders}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 20 },
                },
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              disableRowSelectionOnClick
            />
          )}
        </>
      )}
    </div>
  );
};

export default FoldersDataTable;
