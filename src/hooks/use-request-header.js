import { useMemo } from 'react';

import { useAuth } from './use-auth';

export const useRequestHeader = () => {
  const auth = useAuth();
  const requestHeaders = useMemo(() => {
    if (!auth?.user) return undefined;
    if (!auth?.user.token) return undefined;

    const requestHeaders = {
      'Content-Security-Policy': 'upgrade-insecure-requests',
      Authorization: `Bearer ${auth?.user.token}`,
    };

    return requestHeaders;
  }, [auth?.user]);

  return requestHeaders;
};
