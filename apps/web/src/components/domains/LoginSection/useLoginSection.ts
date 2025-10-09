import { useLazyQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line import/no-relative-parent-imports
import { GET_HELLO } from '@/graphql/queries';

export const useLoginSection = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user, error } =
    useAuth0();

  const [fetchHello, { data, loading: helloLoading, error: helloError }] =
    useLazyQuery(GET_HELLO);

  const handleLogin = useCallback(() => {
    void loginWithRedirect();
  }, [loginWithRedirect]);

  const handleLogout = useCallback(() => {
    void logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);

  const handleFetchHello = useCallback(() => {
    void fetchHello();
  }, [fetchHello]);

  const userName = useMemo(() => user?.name ?? 'Unknown', [user?.name]);

  const helloMessage = useMemo(() => data?.hello ?? null, [data?.hello]);

  return {
    isAuthenticated,
    isLoading,
    userName,
    error,
    handleLogin,
    handleLogout,
    handleFetchHello,
    helloMessage,
    helloLoading,
    helloError,
  };
};
