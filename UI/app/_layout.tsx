import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import SplashScreen from 'expo-splash-screen';

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
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
  );  
}