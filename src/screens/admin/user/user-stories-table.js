import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { Button, Card, CircularProgress } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import UserService from '@/services/user';

const UserStoriesTable = ({ userId }) => {
  const requestHeader = useRequestHeader();
  const { data: stories, isLoading } = useQuery(
    ['user', userId, 'stories'],
    async () => await new UserService(requestHeader).getStoriesByUserId(userId),
    { enabled: Boolean(userId) },
  );

  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title', // access nested data with dot notation
        header: 'Tên truyện',
        size: 200,
      },
      {
        accessorKey: 'category.name',
        header: 'Thể loại',
      },
    ],
    [router],
  );

  const initialState = {
    columnVisibility: {},
    showGlobalFilter: true,
  };

  if (isLoading)
    return (
      <Card
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px',
        }}>
        <CircularProgress />
      </Card>
    );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={stories}
        initialState={initialState}
        {...SHARED_TABLE_PROPS}
        muiTableHeadCellProps={{
          sx: {
            height: '48px!important',
            fontSize: '14px!important',
          },
        }}
        muiTopToolbarProps={{
          sx: {
            display: 'none',
          },
        }}
        displayColumnDefOptions={{
          'mrt-row-actions': { header: '', size: 150 },
        }}
        renderRowActions={({ row }) => {
          return (
            <Button
              sx={{
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: '12px',
              }}
              variant="outlined"
              onClick={() => {
                router.push(`/stories/${row.original.id}`);
              }}>
              Xem chi tiết
            </Button>
          );
        }}
      />
    </>
  );
};

export default UserStoriesTable;
