import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Index from '../../src/app/index';
import { useAuthContext } from '../../src/context/AuthContext';
import { configureGoogleSignIn, signInWithGoogle } from '../../src/auth/googleAuth';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('../../src/context/AuthContext');
jest.mock('../../src/auth/googleAuth');
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock the image require
jest.mock('../../assets/splash-icon-dark.png', () => 'splash-icon-dark.png', { virtual: true });

describe('Index Component - Loading State', () => {
  const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>;
  const mockConfigureGoogleSignIn = configureGoogleSignIn as jest.MockedFunction<typeof configureGoogleSignIn>;
  const mockSignInWithGoogle = signInWithGoogle as jest.MockedFunction<typeof signInWithGoogle>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays "Loading..." text when loading is true', () => {
    // Arrange: Mock the auth context to return loading state
    mockUseAuthContext.mockReturnValue({
      loading: true,
      userDetails: null,
      logout: jest.fn(),
    });

    // Act: Render the component
    const { getByText, queryByText } = render(<Index />);

    // Assert: Verify loading text is displayed
    expect(getByText('Loading...')).toBeTruthy();
    
    // Assert: Verify that the main content is not displayed
    expect(queryByText('InvoiceGen')).toBeNull();
    expect(queryByText('Fast. Simple. Paperless.')).toBeNull();
    expect(queryByText('Sign In with Google')).toBeNull();
  });

  test('calls configureGoogleSignIn on mount', () => {
    // Arrange
    mockUseAuthContext.mockReturnValue({
      loading: true,
      userDetails: null,
      logout: jest.fn(),
    });

    // Act
    render(<Index />);

    // Assert
    expect(mockConfigureGoogleSignIn).toHaveBeenCalledTimes(1);
  });

  test('calls configureGoogleSignIn once when not loading and unauthenticated', () => {
    mockUseAuthContext.mockReturnValue({
      loading: false,
      userDetails: null,
      logout: jest.fn(),
    });

    render(<Index />);

    expect(mockConfigureGoogleSignIn).toHaveBeenCalledTimes(1);
  });

  test('does not redirect when loading is true', () => {
    // Arrange
    mockUseAuthContext.mockReturnValue({
      loading: true,
      userDetails: { uid: '123', displayName: 'Test User', email: 'test@example.com', businessLogo: '' },
      logout: jest.fn(),
    });

    // Act
    render(<Index />);

    // Assert: Router should not be called when loading
    expect(router.replace).not.toHaveBeenCalled();
  });

  test('shows sign-in screen when not loading and unauthenticated', () => {
    mockUseAuthContext.mockReturnValue({
      loading: false,
      userDetails: null,
      logout: jest.fn(),
    });

    const { getByText } = render(<Index />);

    expect(getByText('InvoiceGen')).toBeTruthy();
    expect(getByText('Fast. Simple. Paperless.')).toBeTruthy();
    expect(getByText('Sign In with Google')).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();
  });

  test('navigates to /invoice/create after successful sign-in', async () => {
    mockUseAuthContext.mockReturnValue({
      loading: false,
      userDetails: null,
      logout: jest.fn(),
    });
    mockSignInWithGoogle.mockResolvedValue({
      user: { uid: '123', displayName: 'Test User', email: 'test@example.com' },
    } as any);

    const { getByText } = render(<Index />);

    fireEvent.press(getByText('Sign In with Google'));

    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/invoice/create'));
  });
});
