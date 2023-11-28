import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Chip, MenuItem, SvgIcon } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';

import { SHARED_TABLE_PROPS } from '@/constants/table';
import { formatDate } from '@/utils/formatters';

const StoryChapterTable = ({ story }) => {
  const router = useRouter();

  const chapters = story?.chapters ?? [];

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
      },
      {
        accessorKey: 'position',
        header: 'Thứ tự',
        size: 10,
        enableColumnActions: false,
      },
      {
        accessorKey: 'title',
        header: 'Tiêu đề',
        size: 250,
      },
      {
        accessorKey: 'is_draft',
        header: 'Trạng thái',
        accessorFn: (row) => (row.is_draft ? 'Viết nháp' : 'Đã xuất bản'),
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Đã xuất bản', value: 'Đã xuất bản' },
          { text: 'Viết nháp', value: 'Viết nháp' },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            sx={{
              backgroundColor:
                cell.getValue() === 'Viết nháp'
                  ? 'error.alpha20'
                  : 'success.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'is_paywalled',
        header: 'Tính phí',
        accessorFn: (row) => (row.is_paywalled ? 'Tính phí' : 'Miễn phí'),

        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'Tính phí', value: 'Tính phí' },
          { text: 'Miễn phí', value: 'Miễn phí' },
        ],
        filterVariant: 'select',
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            sx={{
              backgroundColor:
                cell.getValue() === 'Miễn phí'
                  ? 'success.alpha20'
                  : 'error.alpha20',
            }}
          />
        ),
      },
      {
        accessorKey: 'updated_date',
        header: 'Ngày cập nhật',
        accessorFn: (row) => formatDate(row.updated_date),
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

  return (
    <MaterialReactTable
      {...SHARED_TABLE_PROPS}
      displayColumnDefOptions={{
        'mrt-row-actions': { header: 'Hành động', size: 80 },
      }}
      renderRowActionMenuItems={({ closeMenu, row, table }) => [
        <MenuItem
          key="show"
          onClick={() => {
            router.push(
              `/admin/stories/${story.id}/chapters/${row.original.id}`,
            );
          }}>
          <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
            <Visibility />
          </SvgIcon>
          Xem
        </MenuItem>,
        // <MenuItem
        //   key="edit"
        //   onClick={() => {
        //     router.push(`/admin/stories/${row.original.id}`);
        //   }}>
        //   <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
        //     <Edit />
        //   </SvgIcon>
        //   Chỉnh sửa
        // </MenuItem>,
        <MenuItem
          key="de-activate"
          sx={{ color: 'error.main' }}
          onClick={() => {}}>
          <SvgIcon fontSize="small" sx={{ width: '16px', mr: '8px' }}>
            <VisibilityOff />
          </SvgIcon>
          Vô hiệu hóa
        </MenuItem>,
      ]}
      columns={columns}
      data={chapters}
      initialState={initialState}
    />
  );
};

export default StoryChapterTable;
