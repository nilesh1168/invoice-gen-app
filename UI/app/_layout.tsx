import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';
import { KeyboardProvider } from 'react-native-keyboard-controller';

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