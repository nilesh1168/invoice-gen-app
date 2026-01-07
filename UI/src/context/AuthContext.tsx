import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BusinessInfo, AuthContextType } from '../constants/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  const userDetails: BusinessInfo | null = user
    ? {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || undefined,
        logo: user.logo || undefined,
        address: '',
      }
    : null;

  const handleLogout = async () => {
    const { logout: firebaseLogout } = await import('../auth/googleAuth');
    await firebaseLogout();
  };

  const value: AuthContextType = {
    loading,
    logout: handleLogout,
    userDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
}
