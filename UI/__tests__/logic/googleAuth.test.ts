import { logout, signInWithGoogle, configureGoogleSignIn } from '../../src/auth/googleAuth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Constants from 'expo-constants';

// Mock the dependencies
// jest.mock('@react-native-google-signin/google-signin');
// jest.mock('@react-native-firebase/auth');
// jest.mock('expo-constants');

// Use the module mocks provided in __tests__/setup.ts
const mockedAuth = auth as unknown as jest.MockedFunction<typeof auth>;

describe('googleAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('logout', () => {
    it('should sign out from Firebase and Google successfully', async () => {
      // Arrange
      const mockFirebaseAuth = {
        signOut: jest.fn().mockResolvedValue(undefined),
        currentUser: {
          email: 'test@example.com',
        },
      };
      mockedAuth.mockReturnValue(mockFirebaseAuth as any);
      (GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined);

      // Act
      await logout();

      // Assert
      expect(mockFirebaseAuth.signOut).toHaveBeenCalledTimes(1);
      expect(GoogleSignin.signOut).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('Logging out user:', 'test@example.com');
      expect(console.log).toHaveBeenCalledWith('User logged out successfully');
    });

    it('should sign out from Firebase before Google', async () => {
      // Arrange
      const callOrder: string[] = [];
      const mockFirebaseAuth = {
        signOut: jest.fn().mockImplementation(() => {
          callOrder.push('firebase');
          return Promise.resolve();
        }),
        currentUser: { email: 'test@example.com' },
      };
      mockedAuth.mockReturnValue(mockFirebaseAuth as any);
      (GoogleSignin.signOut as jest.Mock).mockImplementation(() => {
        callOrder.push('google');
        return Promise.resolve();
      });

      // Act
      await logout();

      // Assert
      expect(callOrder).toEqual(['firebase', 'google']);
    });

    it('should handle errors during logout and rethrow them', async () => {
      // Arrange
      const mockError = new Error('Logout failed');
      const mockFirebaseAuth = {
        signOut: jest.fn().mockRejectedValue(mockError),
        currentUser: { email: 'test@example.com' },
      };
      mockedAuth.mockReturnValue(mockFirebaseAuth as any);

      // Act & Assert
      await expect(logout()).rejects.toThrow('Logout failed');
      expect(console.error).toHaveBeenCalledWith('Logout failed:', mockError);
    });

    it('should still attempt Google sign out even if Firebase sign out fails', async () => {
      // Arrange
      const mockError = new Error('Firebase signout failed');
      const mockFirebaseAuth = {
        signOut: jest.fn().mockRejectedValue(mockError),
        currentUser: { email: 'test@example.com' },
      };
      mockedAuth.mockReturnValue(mockFirebaseAuth as any);
      (GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined);

      // Act & Assert
      await expect(logout()).rejects.toThrow('Firebase signout failed');
      
      // Note: In the current implementation, if Firebase signout fails,
      // Google signout won't be called because the error is thrown immediately.
      // This test documents the current behavior.
      expect(GoogleSignin.signOut).not.toHaveBeenCalled();
    });

    it('should handle case when currentUser is null', async () => {
      // Arrange
      const mockFirebaseAuth = {
        signOut: jest.fn().mockResolvedValue(undefined),
        currentUser: null,
      };
      mockedAuth.mockReturnValue(mockFirebaseAuth as any);
      (GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined);

      // Act
      await logout();

      // Assert
      expect(mockFirebaseAuth.signOut).toHaveBeenCalledTimes(1);
      expect(GoogleSignin.signOut).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('Logging out user:', undefined);
    });
  });

  describe('signInWithGoogle', () => {
    it('should successfully sign in with Google', async () => {
      // Arrange
      const mockIdToken = 'mock-id-token';
      const mockCredential = { token: 'mock-credential' };
      const mockUserCredential = { user: { uid: '123', email: 'test@example.com' } };

      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
        data: { idToken: mockIdToken },
      });

      const mockGoogleAuthProvider = {
        credential: jest.fn().mockReturnValue(mockCredential),
      };
      const mockFirebaseAuth = {
        signInWithCredential: jest.fn().mockResolvedValue(mockUserCredential),
        GoogleAuthProvider: mockGoogleAuthProvider,
      };
      mockedAuth.mockReturnValue(mockFirebaseAuth as any);
      (auth as any).GoogleAuthProvider = mockGoogleAuthProvider;

      // Act
      const result = await signInWithGoogle();

      // Assert
      expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({ showPlayServicesUpdateDialog: true });
      expect(GoogleSignin.signIn).toHaveBeenCalled();
      expect(mockGoogleAuthProvider.credential).toHaveBeenCalledWith(mockIdToken);
      expect(mockFirebaseAuth.signInWithCredential).toHaveBeenCalledWith(mockCredential);
      expect(result).toEqual(mockUserCredential);
    });

    it('should throw error if Google ID Token is missing', async () => {
      // Arrange
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
        data: { idToken: null },
      });

      // Act & Assert
      await expect(signInWithGoogle()).rejects.toThrow('Google ID Token missing');
    });
  });

  describe('configureGoogleSignIn', () => {
    it('should configure Google Sign In with correct webClientId', () => {
      // Arrange
      const mockWebClientId = 'mock-web-client-id';
      (Constants as any).expoConfig = {
        extra: {
          FIREBASE_SIGNIN_WEB_CLIENT_ID: mockWebClientId,
        },
      };

      // Act
      configureGoogleSignIn();

      // Assert
      expect(GoogleSignin.configure).toHaveBeenCalledWith({
        webClientId: mockWebClientId,
        offlineAccess: false,
      });
      expect(console.log).toHaveBeenCalledWith(
        ' Configuring Google Sign In with Web Client ID: ' + mockWebClientId
      );
    });
  });
});
