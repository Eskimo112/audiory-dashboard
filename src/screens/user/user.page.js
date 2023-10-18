import { useCallback, useMemo, useState } from 'react';

import Head from 'next/head';

import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Card,
  Container,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useQuery } from 'react-query';

import AppMultiSelect from '../../components/app-multi-select';
import useDebounce from '../../hooks/use-debounce';
import UserService from '../../services/user';
import { applyPagination } from '../../utils/apply-pagination';
import FilterPile from './filter-pile.component';
import { UsersTable } from './user-table.component';

const ROLE_MAP = {
  'b794308e-4b3a-11ee-9d9d-00155d78bd44': 'user',
  'b341e067-4b3a-11ee-9d9d-00155d78bd44': 'admin',
};

const UserPage = () => {
  const { data = [] } = useQuery(
    ['users'],
    async () => await UserService.getAll(),
  );

  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debounceSearchValue = useDebounce(searchValue, 500);

  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    // Filter by search value
    let result = data.filter((item) =>
      Object.values(item).some((value) => {
        if (!value) return false;
        if (
          value
            .toString()
            .toLowerCase()
            .includes(debounceSearchValue.toLowerCase())
        )
          return true;
        return false;
      }),
    );

    // Filter by role value
    if (roleFilter.length > 0) {
      result = result.filter((item) =>
        roleFilter.some((role) => role === ROLE_MAP[item.role_id]),
      );
    }

    // Filter by role value
    if (statusFilter.length > 0) {
      result = result.filter((item) => {
        const statusValue = item.is_enabled ? 'active' : 'inactive';

        return statusFilter.some((status) => status === statusValue);
      });
    }

    return result;
  }, [data, debounceSearchValue, roleFilter, statusFilter]);

  // const usersSelection = useSelection(users);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Users | Audiory</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Người dùng</Typography>
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
                  Thêm người dùng
                </Button>
              </div>
            </Stack>
            <Card sx={{ padding: 2 }}>
              <Stack direction="row" gap="16px">
                <Box display="flex" flex="1">
                  <OutlinedInput
                    value={searchValue}
                    fullWidth
                    placeholder="Tìm kiếm người dùng"
                    onChange={(e) => setSearchValue(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <MagnifyingGlassIcon />
                        </SvgIcon>
                      </InputAdornment>
                    }
                  />
                </Box>

                <Box display="flex" width="150px">
                  <AppMultiSelect
                    value={roleFilter}
                    options={[
                      { value: 'admin', label: 'Quản trị viên' },
                      { value: 'user', label: 'Người dùng' },
                    ]}
                    onChange={(values) => {
                      setRoleFilter(values);
                    }}
                    placeholder="Vai trò"
                  />
                </Box>
                <Box display="flex" width="150px">
                  <AppMultiSelect
                    value={statusFilter}
                    options={[
                      { value: 'active', label: 'Hoạt động' },
                      { value: 'inactive', label: 'Vô hiệu hóa' },
                    ]}
                    onChange={(values) => {
                      setStatusFilter(values);
                    }}
                    placeholder="Trạng thái"
                  />
                </Box>
              </Stack>
            </Card>

            {(roleFilter.length > 0 ||
              statusFilter.length > 0 ||
              searchValue !== '') && (
              <Card
                sx={{
                  padding: 2,
                  display: 'flex',
                  gap: '8px',
                  flexDirection: 'column',
                }}>
                <Typography variant="body1" color="ink.main" fontWeight={600}>
                  {filteredUsers.length} kết quả
                </Typography>

                <Stack direction="row" gap="16px" alignItems="center">
                  <FilterPile
                    contents={searchValue ? [searchValue] : []}
                    title="Tìm kiếm:"
                    onDelete={() => setSearchValue('')}
                  />
                  <FilterPile
                    contents={roleFilter}
                    title="Vai trò:"
                    onDelete={(value) =>
                      setRoleFilter(roleFilter.filter((e) => e !== value))
                    }
                  />
                  <FilterPile
                    contents={statusFilter}
                    title=" Trạng thái:"
                    onDelete={(value) =>
                      setStatusFilter(statusFilter.filter((e) => e !== value))
                    }
                  />
                </Stack>
              </Card>
            )}

            <UsersTable
              count={filteredUsers.length}
              items={applyPagination(filteredUsers, page, rowsPerPage)}
              // onDeselectAll={usersSelection.handleDeselectAll}
              // onDeselectOne={usersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              // onSelectAll={usersSelection.handleSelectAll}
              // onSelectOne={usersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              // selected={usersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default UserPage;
