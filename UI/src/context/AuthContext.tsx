import React, { createContext, useContext, ReactNode } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { logout as firebaseLogout } from '../auth/googleAuth';
import { BusinessInfo } from '../constants/types';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  logout: () => Promise<void>;
  userDetails: BusinessInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  const userDetails: BusinessInfo | null = user
    ? {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || undefined,
        logo: user.photoURL || undefined,
        address: '',
      }
    : null;

  const handleLogout = async () => {
    await firebaseLogout();
  };

  const value: AuthContextType = {
    user,
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
