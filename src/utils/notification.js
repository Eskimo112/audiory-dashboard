import { CheckCircle, RemoveCircle } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

const ICON_SIZE_PX = 14;
const AUTO_HIDE_DURATION_MS = 2000;

const ERROR_OPTION = {
  variant: 'custom',
  autoHideDuration: AUTO_HIDE_DURATION_MS,
  icon: (
    <RemoveCircle
      sx={{ color: 'error.main' }}
      name="toast-warning"
      size={ICON_SIZE_PX}
    />
  ),
};

const SUCCESS_OPTION = {
  variant: 'custom',
  autoHideDuration: AUTO_HIDE_DURATION_MS,
  icon: (
    <CheckCircle
      name="toast-success"
      size={ICON_SIZE_PX}
      sx={{ color: 'success.main' }}
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
