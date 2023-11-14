import { useRouter } from 'next/router';

import { useAuth } from '@/hooks/use-auth';

const NotFound = () => {
  const router = useRouter();
  const auth = useAuth();
  auth.user.role_id === 1 ? router.replace('/my-works') : router.replace('/');
};

export default NotFound;
