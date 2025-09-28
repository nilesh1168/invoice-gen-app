import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import { Colors } from '../constants/colors';
import { Button } from '../components/ui/Button';
import { router } from 'expo-router';

export default function index() {
  return (
    <View style={styles.container}>
      {/* Image in the center */}
      <Image
        source={require('../assets/invoicegen.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Invoicing, Simplified.</Text>

      {/* Sign-in buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => {router.push('/invoice/create')}}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    maxWidth: 300,
  },
  button: {
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
