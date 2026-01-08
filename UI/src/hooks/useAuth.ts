import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Business } from '../constants/types';

export function useAuth() {
  const [user, setUser] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser as Business | null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}