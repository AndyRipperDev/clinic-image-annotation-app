import React, { useState } from 'react';
import {
  FormControl,
  IconButton,
  type SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import Button from '@mui/material/Button';
import ErrorAlert from '../Feedback/ErrorAlert';
import PropTypes from 'prop-types';
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
} from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ColorSelector from './ColorSelector';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const AnnotationConfigurationInput = ({
  configAnnotations,
  setConfigAnnotations,
  disabled = false,
}): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [annotationName, setAnnotationName] = useState<string>('');
  const [color, setColor] = useState<string>('red');

  const deleteAction = (row): void => {
    setConfigAnnotations(
      configAnnotations.filter(
        (configAnnotation) => configAnnotation.name !== row.name,
      ),
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Annotation Name',
      width: 800,
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 150,
      valueFormatter: (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
    {
      field: 'action',
      headerName: 'Options',
      sortable: false,
      width: 100,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {!disabled && (
            <Tooltip title="Delete">
              <IconButton
                color="primary"
                aria-label="delete"
                size="large"
                onClick={() => {
                  deleteAction(row);
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  const addAction = (): void => {
    if (annotationName.trim() === '') {
      setErrorMessage('Annotation Name is requred');
      return;
    }

    const existingNames = configAnnotations.filter(
      (configAnnotation) => configAnnotation.name === annotationName,
    );

    if (existingNames.length !== 0) {
      setErrorMessage('Annotation Name already exists');
      return;
    }

    setErrorMessage(null);

    const newAnnotation = {
      name: annotationName,
      color,
    };

    setConfigAnnotations((configAnnotations) => [
      ...configAnnotations,
      newAnnotation,
    ]);

    setColor('red');
    setAnnotationName('');
  };

  const handleColorChange = (event: SelectChangeEvent): void => {
    setColor(event.target.value);
  };

  return (
    <>
      {errorMessage !== null && (
        <ErrorAlert text={errorMessage} marginTop={4} />
      )}
      {!disabled && (
        <>
          <TextField
            autoFocus
            required
            margin="dense"
            id="annotationName"
            name="annotationName"
            label="Annotation Name"
            type="text"
            variant="standard"
            sx={{ m: 1, mt: 2.1, width: '75ch' }}
            value={annotationName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAnnotationName(event.target.value);
            }}
          />
          <FormControl variant="standard" required sx={{ m: 1, width: '25ch' }}>
            <ColorSelector color={color} onChange={handleColorChange} />
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            sx={{ m: 1, mt: 3.5 }}
            onClick={addAction}
          >
            Add
          </Button>
        </>
      )}

      {configAnnotations.length !== 0 && (
        <div style={{ width: '100%' }}>
          <DataGrid
            columnVisibilityModel={{ action: !disabled }}
            sx={{ mt: 4 }}
            getRowId={(row) => row.name}
            rows={configAnnotations}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </div>
      )}
    </>
  );
};

AnnotationConfigurationInput.propTypes = {
  configAnnotations: PropTypes.array,
  setConfigAnnotations: PropTypes.func,
  disabled: PropTypes.bool,
};

export default AnnotationConfigurationInput;
