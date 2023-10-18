import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Scrollbar } from 'src/components/scrollbar';

const ROLE_ID_MAP = {
  'b794308e-4b3a-11ee-9d9d-00155d78bd44': 'Người dùng',
  'b341e067-4b3a-11ee-9d9d-00155d78bd44': 'Quản trị viên',
};

export const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const router = useRouter();

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell> */}
                <TableCell align="center">Thông tin</TableCell>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Tên đăng nhập</TableCell>
                <TableCell align="center">Vai trò</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const isSelected = selected.includes(user.id);
                // const createdAt = format(customer.createdAt, "dd/MM/yyyy");

                return (
                  <TableRow
                    onClick={() => {
                      router.push(`/users/${user.id}`);
                    }}
                    hover
                    key={user.id}
                    sx={{ cursor: 'pointer' }}
                    selected={isSelected}>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell> */}
                    <TableCell align="center">
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        direction="row"
                        spacing={2}>
                        <Avatar
                          src={user.avatar_url}
                          width={50}
                          height={50}></Avatar>
                        <Stack alignItems="start">
                          <Typography variant="subtitle2">
                            {user.full_name ?? 'Không có tên'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontStyle="italic"
                            color="ink.lighter">
                            {user.email ?? 'Không có email'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">{user.id}</TableCell>
                    <TableCell align="center">{user.username}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={ROLE_ID_MAP[user.role_id]}
                        sx={{
                          backgroundColor:
                            ROLE_ID_MAP[user.role_id] === 'Người dùng'
                              ? 'success.alpha20'
                              : 'error.alpha20',
                        }}></Chip>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        sx={{
                          backgroundColor: user.is_enabled
                            ? 'success.alpha20'
                            : 'error.alpha20',
                        }}
                        label={
                          user.is_enabled ? 'Hoạt động' : 'Vô hiệu hóa'
                        }></Chip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
