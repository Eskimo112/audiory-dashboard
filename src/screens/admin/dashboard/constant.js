export const SHARED_SELECT_PROPS = {
  variant: 'filled',
  inputProps: {
    sx: {
      padding: '5px 8px',
    },
  },

  slotProps: {
    root: {
      sx: {
        border: '1px solid',
        borderColor: 'sky.main',
        boxShadow: 'none',
        height: 'auto!important',
      },
    },
  },
};

export const TIME_OPTIONS = [
  { label: '7 ngày gần nhất', value: '7_recent_days' },
  { label: '14 ngày gần nhất', value: '14_recent_days' },
  { label: '30 ngày gần nhất', value: '30_recent_days' },
  { label: '90 ngày gần nhất', value: '90_recent_days' },
];

export const METRIC_OPTIONS = [
  { label: 'Lượt đọc', value: 'total_read' },
  { label: 'Lượt bình chọn', value: 'total_vote' },
  { label: 'Lượt bình luận', value: 'total_comment' },
];
