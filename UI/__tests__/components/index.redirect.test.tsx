import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Index from '../../src/app/index';
import { useAuthContext } from '../../src/context/AuthContext';
import { configureGoogleSignIn } from '../../src/auth/googleAuth';
import { router } from 'expo-router';

jest.mock('../../src/context/AuthContext');
jest.mock('../../src/auth/googleAuth');
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('../../assets/splash-icon-dark.png', () => 'splash-icon-dark.png', { virtual: true });

describe('Index Component - Authenticated Redirect', () => {
  const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>;
  const mockConfigureGoogleSignIn = configureGoogleSignIn as jest.MockedFunction<typeof configureGoogleSignIn>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to /invoice/create when user is authenticated and not loading', async () => {
    mockUseAuthContext.mockReturnValue({
      loading: false,
      userDetails: {
        uid: '123',
        displayName: 'Test User',
        email: 'test@example.com',
        businessLogo: '',
      },
      logout: jest.fn(),
    });

    render(<Index />);

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/invoice/create'));
    expect(mockConfigureGoogleSignIn).toHaveBeenCalledTimes(1);
  });
});
