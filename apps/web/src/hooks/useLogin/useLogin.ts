import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo } from 'react';

export const useLogin = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user, error } =
    useAuth0();

  const handleLogin = useCallback(() => {
    void loginWithRedirect();
  }, [loginWithRedirect]);

  const handleLogout = useCallback(() => {
    void logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);

  const userName = useMemo(() => user?.name ?? 'Unknown', [user?.name]);

  return {
    isAuthenticated,
    isLoading,
    userName,
    error,
    handleLogin,
    handleLogout,
  };
};
