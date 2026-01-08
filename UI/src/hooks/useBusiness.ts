import { useState } from 'react';
import { Business } from '../constants/types';

export const useBusiness = () => {
  const [business, setBusiness] = useState<Business>({
    uid: '',
    displayName: '',
    email: '',
    businessLogo: '',
  });

  const updateBusiness = (updates: Partial<Business>) => {
    setBusiness(prev => ({ ...prev, ...updates }));
  };

  const resetBusiness = () => {
    setBusiness({
      uid: '',
      displayName: '',
      email: '',
      businessLogo: '',
    });
  };

  return {
    business,
    updateBusiness,
    resetBusiness,
  };
};
