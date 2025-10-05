import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineItem } from '../../constants/types';
import { Colors } from '../../constants/colors';
import { TextInput } from '../ui/TextInput';
import { Currency } from '../../constants/currencies';

interface LineItemInputProps {
  item: LineItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<LineItem>) => void;
  currency: string;
}

export const LineItemInput: React.FC<LineItemInputProps> = ({ item, onRemove, onUpdate, currency }) => {
  return (
    <View style={styles.lineItem}>
      <TextInput
        label="Description"
        value={item.description}
        onChangeText={(text) => onUpdate(item.id, { description: text })}
        placeholder="Item description"
        style={styles.textInputStyle}
        required
      />
      <View style={styles.row}>
        <TextInput
          label="Quantity"
          value={item.quantity.toString()}
          onChangeText={(text) => onUpdate(item.id, { quantity: Number(text) || 0 })}
          keyboardType="numeric"
          style={styles.textInputStyle}
          required
        />
        <TextInput
          label="Unit Price"
          value={item.unitPrice.toString()}
          onChangeText={(text) => onUpdate(item.id, { unitPrice: Number(text) || 0 })}
          keyboardType="numeric"
          style={styles.textInputStyle}
          required
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{Currency[currency]} {item.total.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputStyle:{
    backgroundColor: Colors.background,
  },
  lineItem: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  totalContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removeButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
});