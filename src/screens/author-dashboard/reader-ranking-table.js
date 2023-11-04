import React, { useMemo } from 'react';

import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { SHARED_TABLE_PROPS } from '../../constants/table';
import { useRequestHeader } from '../../hooks/use-request-header';
import AuthorDashboardService from '../../services/author-dashboard';

const ReaderRankingTable = () => {
  const requestHeader = useRequestHeader();
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery(
    ['author', 'ranking-reader'],
    async () =>
      await new AuthorDashboardService(requestHeader).getReaderRanking(),
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Thông tin',
        Cell: (cell) => {
          const user = cell.row.original;
          return (
            <Stack
              alignItems="center"
              // justifyContent="center"
              direction="row"
              spacing={2}>
              <Avatar src={user.avatar_url} width={50} height={50}></Avatar>
              <Stack alignItems="start">
                <Typography variant="subtitle2">
                  {user.full_name ?? 'Không có tên'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontStyle="italic"
                  color="ink.lighter">
                  {user.username ?? 'Không có username'}
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'is_online',
        header: 'Trạng thái',
        size: 80,
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Online', value: true },
          { text: 'Offline', value: false },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? 'Online' : 'Offline'}
            sx={{
              backgroundColor: cell.getValue()
                ? 'success.alpha20'
                : 'error.alpha20',
            }}
          />
        ),
      },
    ],
    [],
  );

  const initialState = {
    columnVisibility: {
      id: false,
    },
    showGlobalFilter: true,
    pagination: { pageIndex: 0, pageSize: 5 },
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Card>
      <CardHeader
        action={
          <Stack direction="row" gap="8px">
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={
                <SvgIcon fontSize="small">
                  <ArrowPathIcon />
                </SvgIcon>
              }>
              Làm mới
            </Button>
            {/* <Button color="inherit" size="small" sx={{ padding: 0 }}>
              <Select
                {...SHARED_SELECT_PROPS}
                value={option}
                label="Thời gian"
                onChange={handleChange}>
                {TIME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Button> */}
          </Stack>
        }
        title="Xếp hạng độc giả"
      />
      <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <MaterialReactTable
            {...SHARED_TABLE_PROPS}
            enableRowActions={false}
            columns={columns}
            data={users ?? []}
            initialState={initialState}
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
            muiSearchTextFieldProps={{
              placeholder: 'Nhập từ khóa để tìm kiếm',
              sx: { width: '200px', padding: 0 },
              variant: 'outlined',
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReaderRankingTable;
