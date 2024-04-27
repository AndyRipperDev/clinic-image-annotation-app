import React from 'react';
import { Stack } from '@mui/material';
import Title from '../../components/Base/Title';
import FoldersDataTable from '../../components/DataTable/FoldersDataTable';
import FolderCreateModal from '../../components/Modals/FolderCreateModal';

const FoldersPage = (): JSX.Element => {
  return (
    <div>
      <Title text={'Folders'} textAlign={'left'} />
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
        <FolderCreateModal />
      </Stack>

      <FoldersDataTable />
    </div>
  );
};

export default FoldersPage;
