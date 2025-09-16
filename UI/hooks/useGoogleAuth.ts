import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {router} from 'expo-router';

// Import environment variables
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: 'google' | 'apple';
}

export const useGoogleAuth = () => {

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
      iosClientId: iosClientId, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    console.log('Starting Google Sign-In process');
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log('User Info --> ', response.data);
        setUserInfo({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || '',
          avatar: response.data.user.photo || '',
          provider: 'google'
        });
        Alert.alert('Sign-In Successful', `Welcome, ${response.data.user.name || 'User'}!`);
        router.push('/invoice/create');
      } else {
        // sign in was cancelled by user
        console.log('User cancelled the login flow');
        Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in process.');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            console.log('Operation (eg. sign in) already in progress');
            Alert.alert('Sign-In In Progress', 'A sign-in operation is already in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            console.log('Play services not available or outdated');
            Alert.alert('Play Services Error', 'Google Play Services is not available or outdated.');
            break;
          default:
          // some other error happened
            console.log('Some other error happened', error);
            Alert.alert('Sign-In Error', 'An error occurred during sign-in. Please try again.');
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log('An error that is not related to google sign in occurred', error);
        Alert.alert('Sign-In Error', 'An unexpected error occurred. Please try again.');
      }
    }
    finally {
      setLoading(false);
    }
  };


  return {
    signInWithGoogle,
    loading
  };
};