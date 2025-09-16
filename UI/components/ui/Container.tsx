import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  ViewStyle,
} from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface AdaptiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  includeStatusBar?: boolean;
  includeNavigationBar?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

// Enhanced version with more granular control
interface AdvancedAdaptiveContainerProps extends AdaptiveContainerProps {
  excludeTopInset?: boolean;
  excludeBottomInset?: boolean;
  excludeLeftInset?: boolean;
  excludeRightInset?: boolean;
  customTopOffset?: number;
  customBottomOffset?: number;
}

const AdvancedAdaptiveContainer: React.FC<AdvancedAdaptiveContainerProps> = ({
  children,
  style,
  backgroundColor = '#ffffff',
  paddingHorizontal = 0,
  paddingVertical = 0,
  excludeTopInset = false,
  excludeBottomInset = false,
  excludeLeftInset = false,
  excludeRightInset = false,
  customTopOffset = 0,
  customBottomOffset = 0,
}) => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: excludeTopInset ? customTopOffset : insets.top + customTopOffset,
    paddingBottom: excludeBottomInset ? customBottomOffset : insets.bottom + customBottomOffset,
    paddingLeft: excludeLeftInset ? paddingHorizontal : insets.left + paddingHorizontal,
    paddingRight: excludeRightInset ? paddingHorizontal : insets.right + paddingHorizontal,
    paddingHorizontal: 0, // Override since we're handling left/right manually
    paddingVertical, // Additional vertical padding
    ...style,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {children}
    </View>
  );
};

// Hook for getting adaptive dimensions
const useAdaptiveDimensions = () => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

  const getAdaptiveHeight = (excludeInsets = false): number => {
    if (excludeInsets) return screenHeight;
    
    if (Platform.OS === 'ios') {
      return screenHeight - insets.top - insets.bottom;
    }
    
    // Android
    const statusBarHeight = StatusBar.currentHeight || 0;
    return screenHeight - statusBarHeight - insets.bottom;
  };

  const getAdaptiveWidth = (excludeInsets = false): number => {
    if (excludeInsets) return screenWidth;
    return screenWidth - insets.left - insets.right;
  };

  return {
    adaptiveHeight: getAdaptiveHeight(),
    adaptiveWidth: getAdaptiveWidth(),
    fullHeight: screenHeight,
    fullWidth: screenWidth,
    insets,
    getAdaptiveHeight,
    getAdaptiveWidth,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});


export default AdvancedAdaptiveContainer