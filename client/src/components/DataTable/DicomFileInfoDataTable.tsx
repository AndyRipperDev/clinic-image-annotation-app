import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  type GridRowParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import CircularLoading from '../Loadings/CircularLoading';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { type IDicomFileInfo } from '../../interfaces/dicomFileInfo';
import DicomFileDownloader from '../Downloader/DicomFileDownloader';
import ErrorAlert from '../Feedback/ErrorAlert';
import InfoAlert from '../Feedback/InfoAlert';

const fetchDicomFilesInfo = async (
  folderName: string,
): Promise<IDicomFileInfo[]> => {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/folders/${folderName}/dicom`,
  );

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw data?.error;
  }
};

const DicomFileInfoDataTable = ({ folderName }): JSX.Element => {
  const [dicomFilesInfo, setDicomFilesInfo] = useState<IDicomFileInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const redirectAction = (row): void => {
    // navigate(`/annotations/${folderName}/${row.uuid}`);
    navigate(`/folders/${folderName}/annotations/${row.uuid}`);
  };

  const deleteAction = async (row): Promise<void> => {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/folders/${folderName}/dicom/${row.uuid}`,
      {
        method: 'DELETE',
      },
    );

    if (response.ok) {
      setDicomFilesInfo(
        dicomFilesInfo.filter(
          (dicomFileInfo) => dicomFileInfo.uuid !== row.uuid,
        ),
      );
    } else {
      const data = await response.json();
      setErrorMessage(data?.error as string);
    }
  };

  const columns: GridColDef[] = [
    { field: 'uuid', headerName: 'UUID', width: 200 },
    { field: 'fileName', headerName: 'Name', width: 800 },
    {
      field: 'created',
      headerName: 'Created',
      type: 'dateTime',
      width: 200,
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: 'lastAnnotaionDate',
      headerName: 'Last annotated',
      type: 'dateTime',
      width: 200,
      valueGetter: (value) => value && new Date(value),
    },
    {
      field: 'action',
      headerName: 'Options',
      sortable: false,
      width: 200,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Annotate">
            <IconButton
              color="primary"
              aria-label="annotate"
              size="large"
              onClick={() => {
                redirectAction(row);
              }}
            >
              <DrawOutlinedIcon />
            </IconButton>
          </Tooltip>
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
          <DicomFileDownloader folderName={folderName} dicomFile={row} />
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        setIsLoading(true);
        const data = await fetchDicomFilesInfo(folderName as string);
        setDicomFilesInfo(data);
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
          {dicomFilesInfo.length === 0 ? (
            <InfoAlert
              text={
                'There are no DICOM files yet. Please upload DICOM files via Add DICOM Files button.'
              }
            />
          ) : (
            <DataGrid
              columnVisibilityModel={{ uuid: false }}
              getRowId={(row) => row.uuid}
              rows={dicomFilesInfo}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
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

DicomFileInfoDataTable.propTypes = {
  folderName: PropTypes.string,
};

export default DicomFileInfoDataTable;
