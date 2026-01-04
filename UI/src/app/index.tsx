import React, { use, useEffect } from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import { Colors } from '../constants/colors';
import { Button } from '../components/ui/Button';
import { router } from 'expo-router';
import { signInWithGoogle, configureGoogleSignIn, logout } from '../auth/googleAuth';
import { useAuthContext } from '../context/AuthContext';


export default function index() {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/invoice/create');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Image in the center */}
      <Image
        source={require('../../assets/splash-icon-dark.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>InvoiceGen</Text>
      <Text style={styles.subtitle}>Fast. Simple. Paperless.</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign In with Google"
          onPress={async () => {
          try {
            await signInWithGoogle();
            router.replace('/invoice/create');
          } catch (e) {
            console.error(e);
          }
        }}
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
