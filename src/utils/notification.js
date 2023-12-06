import { CheckCircle, RemoveCircle } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

const ICON_SIZE_PX = 18;
const AUTO_HIDE_DURATION_MS = 2000;

const ERROR_OPTION = {
  variant: 'custom',
  autoHideDuration: AUTO_HIDE_DURATION_MS,
  icon: (
    <RemoveCircle
      sx={{ color: 'error.main', width: `${ICON_SIZE_PX}px` }}
      name="toast-warning"
    />
  ),
};

const SUCCESS_OPTION = {
  variant: 'custom',
  autoHideDuration: AUTO_HIDE_DURATION_MS,

  icon: (
    <CheckCircle
      name="toast-success"
      sx={{ color: 'success.main', width: `${ICON_SIZE_PX}px` }}
    />
  ),
};

export function toastSuccess(message, opt) {
  if (typeof window === 'undefined') return;
  enqueueSnackbar(message, { ...SUCCESS_OPTION, ...opt });
}

export function toastError(message, opt) {
  if (typeof window === 'undefined') return;
  enqueueSnackbar(message, { ...ERROR_OPTION, ...opt });
}
