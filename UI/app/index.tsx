import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Button } from '../components/ui/Button';

export default function index() {
  return (
    <View style={styles.container}>
      {/* Image in the center */}
      <Image
        source={require('../assets/invoicegen.png')} 
        style={styles.image}
        resizeMode="contain"
      />

      {/* Button below the image */}
       <Button
      title="Get Started"
      onPress={() => router.push('/invoice/create')}
      variant="primary"
     />
      {/* Footer */}
      {/* <Text style={styles.footer}>© 2025 Nilesh Suryawanshi</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Ivory background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.primary, // Mint Green (Primary)
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: Colors.surface, // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: Colors.textSecondary, // Slate Gray
    fontSize: 14,
  },
});