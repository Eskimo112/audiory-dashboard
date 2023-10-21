export const SHARED_TABLE_PROPS = {
  positionActionsColumn: 'last',
  displayColumnDefOptions: { 'row-actions': { header: '', size: 30 } },
  enableRowActions: true,
  enableGlobalFilterModes: true,
  positionGlobalFilter: 'left',
  muiTablePaperProps: {
    sx: {
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
  },
  muiTableContainerProps: {
    sx: {
      borderRadius: 1,
      boxShadow:
        '0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)',
    },
  },
  muiTopToolbarProps: {
    sx: {
      padding: '10px!important',
      borderRadius: 1,
      boxShadow:
        '0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)',
    },
  },
  muiSearchTextFieldProps: {
    placeholder: 'Nhập từ khóa để tìm kiếm',
    sx: { width: '500px' },
    variant: 'outlined',
  },
};
