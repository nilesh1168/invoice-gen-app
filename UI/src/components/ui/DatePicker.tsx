import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../constants/colors';
import { isAndroid, isIOS } from '../../utils/platform';

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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
        toggleDatePicker();
        onChange(selectedDate);
    }
  }

  const datePickerElement = () => {
    if (isIOS) {
      return (
       <DateTimePicker
            value={value}
            mode="date"
            display="default"
            onChange={handleDateChange}/>
      );
    }
    else{
      return(
        <>
          <TouchableOpacity style={styles.dateButton} onPress={() => toggleDatePicker()}>
                <Text style={styles.dateText}>{formatDate(value)}</Text>
          </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
            value={value}
            mode="date"
            display="default"
            onChange={handleDateChange}/>
            )}
        </>
      )
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
        <View style={styles.pickerContainer}>
          {datePickerElement()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
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
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});