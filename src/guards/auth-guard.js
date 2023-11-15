import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import PropTypes from 'prop-types';
import { useAuthContext } from 'src/contexts/auth-context';

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { user } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (ignore.current) {
      return;
    }

    ignore.current = true;
    if (!isAuthenticated) {
      // role
      console.log('Not authenticated, redirecting');

      router
        .replace({
          pathname: '/auth/login',
          query:
            router.asPath !== '/' ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    }

    setChecked(true);
  }, [router.isReady]);

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.d
  if (!user) return null;

  if (user.role_id === 1 && router.asPath.includes('admin')) {
    console.log(user.role_id)
    router.replace('/my-works');
    return null;
  }
  if (user.role_id === 2 && !router.asPath.includes('admin')) {
    router.replace('/admin');
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
