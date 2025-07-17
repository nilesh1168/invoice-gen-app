import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
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
          name="invoice/create" 
          options={{ 
            title: 'Create Invoice',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="invoice/preview" 
          options={{ 
            title: 'Preview Invoice',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            headerShown: true,
          }} 
        />
      </Stack>
    </>
  );
}