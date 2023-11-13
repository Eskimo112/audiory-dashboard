/* eslint-disable camelcase */
import { MRT_Localization_VI } from 'material-react-table/locales/vi';

export const SHARED_TABLE_PROPS = {
  localization: MRT_Localization_VI,
  positionActionsColumn: 'last',
  displayColumnDefOptions: {
    'mrt-row-actions': { header: 'Hành động', size: 100 },
  },
  enableDensityToggle: false,
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
