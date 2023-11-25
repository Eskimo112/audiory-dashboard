import { useMemo, useState } from 'react';

import Head from 'next/head';

import { DatePicker } from '@mantine/dates';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { MaterialReactTable } from 'material-react-table';
import { useQuery } from 'react-query';

import AppBreadCrumbs from '@/components/app-bread-crumbs';
import { SHARED_PAGE_SX } from '@/constants/page_sx';
import { SHARED_TABLE_PROPS } from '@/constants/table';
import { useRequestHeader } from '@/hooks/use-request-header';
import SystemConfigService from '@/services/system-config';
import { formatDate } from '@/utils/formatters';
import { toastError, toastSuccess } from '@/utils/notification';

const SystemConfigDetailPage = ({ configId }) => {
  const theme = useTheme();
  const requestHeader = useRequestHeader();
  const { data: config = {}, isLoading: configLoading } = useQuery(
    ['system-configs', configId],
    async () => await new SystemConfigService(requestHeader).getById(configId),
  );
  const {
    data: configHistory = [],
    isLoading,
    refetch,
  } = useQuery(
    ['system-configs', 'next-effective', config?.key],
    async () =>
      await new SystemConfigService(requestHeader).getNextEffectiveByKey(
        config?.key,
      ),
    { enabled: Boolean(config?.key) },
  );
  const [value, setValue] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async (config) => {
    try {
      await new SystemConfigService(requestHeader).deleteById(config.id);
      refetch();
      toastSuccess('Xóa thành công');
    } catch (e) {
      toastError('Đã có lỗi xảy ra, thử lại sau.');
    }
    setOpenDialog(false);
  };

  const columns = useMemo(
    () => [
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

      // {
      //   accessorKey: 'updated_date',
      //   header: 'Ngày cập nhật',
      //   accessorFn: (row) => formatDate(row.effective_date),
      // },
    ],
    [],
  );

  const initialState = {
    columnVisibility: {
      id: false,
    },
    showGlobalFilter: true,
  };

  const handleSubmit = async () => {
    if (!value && !effectiveDate) return;
    const body = {
      effective_date: dayjs(effectiveDate).toISOString(),
      key: config?.key,
      value,
    };

    try {
      await new SystemConfigService(requestHeader).create({ body });
      toastSuccess('Thêm thành công');
      refetch();
    } catch (error) {
      toastError('Có lỗi xảy ra. Thử lại sau');
    }
  };

  if (configLoading || isLoading)
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
        <title>Thông số {config?.key} </title>
      </Head>
      <Box component="main" sx={SHARED_PAGE_SX}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
              alignItems="flex-end"
              px="16px">
              <Stack spacing={1}>
                <Typography variant="h4">{config?.key}</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
                <AppBreadCrumbs name1={config?.key} />
              </Stack>
              <Stack direction="row" gap="16px" height="fit-content"></Stack>
            </Stack>
            <Grid container spacing={3}>
              <Grid xs={12} lg={12}>
                <Stack direction="row" gap="16px" alignItems="center">
                  <TextField
                    placeholder="Giá trị"
                    type="number"
                    fullWidth
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    sx={{
                      p: 0,
                      input: {
                        p: '13px',
                        '::placeholder': {
                          color: 'sky.main',
                        },
                      },
                      flex: 1,
                    }}
                  />
                  <DatePicker
                    fullWidth
                    placeholder="Ngày hiệu lực"
                    style={{ flex: 1 }}
                    styles={{
                      input: {
                        minHeight: 0,
                        height: '48px',
                        borderRadius: '8px',
                        borderColor: theme.palette.ink.light,
                      },
                    }}
                    value={effectiveDate}
                    onChange={(value) => setEffectiveDate(value)}
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={!value || !effectiveDate}
                    variant="contained">
                    Thêm giá trị
                  </Button>
                </Stack>
              </Grid>
              <Grid xs={12} lg={12}>
                <MaterialReactTable
                  {...SHARED_TABLE_PROPS}
                  renderRowActionMenuItems={({ closeMenu, row, table }) => [
                    <MenuItem
                      key="edit"
                      sx={{ color: 'error.main' }}
                      onClick={() => {
                        setOpenDialog(true);
                      }}>
                      <SvgIcon
                        fontSize="small"
                        sx={{ width: '16px', mr: '8px' }}>
                        <Delete />
                      </SvgIcon>
                      Xóa
                      <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        PaperProps={{
                          sx: {
                            p: 1,
                            width: '400px',
                          },
                        }}>
                        <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
                        <DialogActions>
                          <Button
                            variant="outlined"
                            onClick={() => setOpenDialog(false)}>
                            Hủy bỏ
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleDelete(row.original)}
                            autoFocus>
                            Xác nhận
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </MenuItem>,
                  ]}
                  columns={columns}
                  data={configHistory}
                  initialState={initialState}
                  muiTopToolbarProps={{
                    sx: {
                      display: 'none',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default SystemConfigDetailPage;
