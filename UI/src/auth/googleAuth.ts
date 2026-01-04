import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Constants from "expo-constants";

export function configureGoogleSignIn() {
  console.log(" Configuring Google Sign In with Web Client ID: " + Constants.expoConfig?.extra?.FIREBASE_SIGNIN_WEB_CLIENT_ID);
  GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.FIREBASE_SIGNIN_WEB_CLIENT_ID,
    offlineAccess: false,
  });
}


export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;

  if (!idToken) {
    throw new Error("Google ID Token missing");
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  return auth().signInWithCredential(googleCredential);
}

export async function logout() {
  try {
    console.log('Logging out user:', auth().currentUser?.email);
    // 1. Sign out from Firebase
    await auth().signOut();

    // 2. Sign out from Google
    await GoogleSignin.signOut();

    // 3. Optional: revoke access (forces account chooser next time)
    // await GoogleSignin.revokeAccess();
    
    console.log('User logged out successfully');
    console.log('Current user after logout:', auth().currentUser?.email);
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}