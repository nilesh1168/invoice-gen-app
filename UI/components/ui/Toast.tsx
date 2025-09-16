import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { ToastMessage, ToastType } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastMessage;
  onHide: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onHide }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const getBackgroundColor = (type: ToastType): string => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity
        style={[styles.toast, { backgroundColor: getBackgroundColor(toast.type) }]}
        onPress={() => onHide(toast.id)}
      >
        <Text style={styles.message}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '500',
  },
});