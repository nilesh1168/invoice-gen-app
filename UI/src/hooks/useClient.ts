import { useState } from 'react';
import { Client } from '../constants/types';

export const useClient = () => {
  const [client, setClient] = useState<Client>({
    uid: '',
    displayName: '',
    email: '',
  });

  const updateClient = (updates: Partial<Client>) => {
    setClient(prev => ({ ...prev, ...updates }));
  };

  const resetClient = () => {
    setClient({
      uid: '',
      displayName: '',
      email: '',
    });
  };

  return {
    client,
    updateClient,
    resetClient,
  };
};
