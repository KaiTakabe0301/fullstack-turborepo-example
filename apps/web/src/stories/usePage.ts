import React, { useCallback } from 'react';

interface User {
  name: string;
}

export function usePage() {
  const [user, setUser] = React.useState<User>();

  const handleLogin = useCallback(() => setUser({ name: 'Jane Doe' }), []);
  const handleLogout = useCallback(() => setUser(undefined), []);
  const handleCreateAccount = useCallback(
    () => setUser({ name: 'Jane Doe' }),
    []
  );

  return {
    user,
    handleCreateAccount,
    handleLogin,
    handleLogout,
  };
}
