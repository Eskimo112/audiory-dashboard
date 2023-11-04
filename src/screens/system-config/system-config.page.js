import { useMemo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import { SHARED_PAGE_SX } from '../../constants/page_sx';
import { SHARED_TABLE_PROPS } from '../../constants/table';
import SystemConfigService from '../../services/system-config';
import { formatDate } from '../../utils/formatters';

const SystemConfigPage = () => {
  const { data: configs, isLoading } = useQuery(
    ['system-config'],
    async () => await SystemConfigService.getAll(),
  );

  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 150,
      },
      {
        accessorKey: 'key',
        header: 'Key',
      },
      {
        accessorKey: 'value',
        header: 'Giá trị',
      },
      {
        accessorKey: 'effective_date',
        header: 'Ngày hiệu lực',
        accessorFn: (row) => formatDate(row.effective_date),
      },
      {
        accessorKey: 'created_date',
        header: 'Ngày tạo',
        accessorFn: (row) => formatDate(row.effective_date),
      },
      {
        accessorKey: 'updated_date',
        header: 'Ngày cập nhật',
        accessorFn: (row) => formatDate(row.effective_date),
      },
    ],
    [],
  );

  const initialState = {
    columnVisibility: {
      id: false,
    },
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
      <Head>
        <title>Hệ thống | Audiory</title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Thông số hệ thống</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained">
                  Thêm thông số
                </Button>
              </div>
            </Stack>

            <MaterialReactTable
              renderRowActionMenuItems={({ closeMenu, row, table }) => [
                <MenuItem
                  key="edit"
                  onClick={() => {
                    router.push(`/tranactions/${row.original.id}`);
                  }}>
                  Chỉnh sửa
                </MenuItem>,
                <MenuItem key="delete" onClick={() => console.info('Delete')}>
                  Vô hiệu hóa
                </MenuItem>,
              ]}
              columns={columns}
              data={configs}
              initialState={initialState}
              {...SHARED_TABLE_PROPS}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default SystemConfigPage;
