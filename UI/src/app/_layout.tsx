import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContextProvider } from '../context/AuthContext';

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = React.useState(false);

    React.useEffect(() => {
    async function prepare() {
      try {
        // Add any initialization logic here
        // For example:
        // - Load fonts
        // - Make API calls
        // - Load cached data
        
        // Artificial delay to show splash screen (remove in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.warn(error);
      } finally {
        setIsAppReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    if (isAppReady) {
      // Hide splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }
  
  return (
    <AuthContextProvider>
      <KeyboardProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Home',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="invoice/create" 
            options={{ 
              title: 'Create Invoice',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="invoice/preview" 
            options={{ 
              title: 'Preview Invoice',
              headerShown: false,
            }} 
          />
        </Stack>
      </KeyboardProvider>
    </AuthContextProvider>
  );  
}