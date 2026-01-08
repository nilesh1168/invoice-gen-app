import React, { useState, useEffect, PropsWithChildren } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
  ViewStyle,
  TextStyle,
  TextInputProps,
  StatusBar,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Constants
import { Colors } from "../constants/colors";

// Utils
import { isAndroid, isIOS } from "../utils/platform";

// Hooks
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastMessage, ToastType } from "../hooks/useToast";

// ============================================================================
// Button Component
// ============================================================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    buttonStyles.button,
    buttonStyles[variant],
    disabled && buttonStyles.disabled,
    style,
  ];

  const buttonTextStyle = [
    buttonStyles.buttonText,
    buttonStyles[`${variant}Text`],
    disabled && buttonStyles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.surface,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  secondaryText: {
    color: Colors.surface,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.textSecondary,
  },
  disabledText: {
    color: Colors.surface,
  },
  error: {
    backgroundColor: "transparent",
  },
  errorText: {
    color: Colors.error,
  },
});

// ============================================================================
// Container Component
// ============================================================================

const Container: React.FC<PropsWithChildren> = ({ children }) => {
  const statusBarHeight = () => {
    if (isAndroid) {
      return StatusBar.currentHeight;
    } else {
      return useSafeAreaInsets().top;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingTop: statusBarHeight(),
        backgroundColor: "white",
      }}
    >
      {children}
    </View>
  );
};

export { Container };

// ============================================================================
// Text Input Component
// ============================================================================

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  required,
  style,
  ...props
}) => {
  return (
    <View style={textInputStyles.container}>
      {label && (
        <Text style={textInputStyles.label}>
          {label}
          {required && <Text style={textInputStyles.required}> *</Text>}
        </Text>
      )}
      <RNTextInput
        style={[textInputStyles.input, error && textInputStyles.inputError, style]}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
      {error && <Text style={textInputStyles.errorText}>{error}</Text>}
    </View>
  );
};

const textInputStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

// ============================================================================
// Date Picker Component
// ============================================================================

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  required,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      toggleDatePicker();
      onChange(selectedDate);
    }
  };

  const datePickerElement = () => {
    if (isIOS) {
      return (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      );
    } else {
      return (
        <>
          <TouchableOpacity
            style={datePickerStyles.dateButton}
            onPress={() => toggleDatePicker()}
          >
            <Text style={datePickerStyles.dateText}>{formatDate(value)}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      );
    }
  };

  return (
    <View style={datePickerStyles.container}>
      <View style={datePickerStyles.row}>
        <View style={datePickerStyles.labelContainer}>
          <Text style={datePickerStyles.label}>
            {label}
            {required && <Text style={datePickerStyles.required}> *</Text>}
          </Text>
        </View>
        <View style={datePickerStyles.pickerContainer}>
          {datePickerElement()}
        </View>
      </View>
    </View>
  );
};

const datePickerStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelContainer: {
    flex: 1,
    marginRight: 12,
  },
  pickerContainer: {
    flex: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.error,
  },
  dateButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});

// ============================================================================
// Toast Component
// ============================================================================

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
      case "success":
        return Colors.success;
      case "error":
        return Colors.error;
      case "warning":
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  return (
    <Animated.View style={[toastStyles.container, { opacity }]}>
      <TouchableOpacity
        style={[
          toastStyles.toast,
          { backgroundColor: getBackgroundColor(toast.type) },
        ]}
        onPress={() => onHide(toast.id)}
      >
        <Text style={toastStyles.message}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const toastStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },
});
