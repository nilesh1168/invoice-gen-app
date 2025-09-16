import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineItem } from '../../constants/types';
import { Colors } from '../../constants/colors';
import { TextInput } from '../ui/TextInput';

interface LineItemInputProps {
  item: LineItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<LineItem>) => void;
}

export const LineItemInput: React.FC<LineItemInputProps> = ({ item, onRemove, onUpdate }) => {
  return (
    <View style={styles.lineItem}>
      <TextInput
        label="Description"
        value={item.description}
        onChangeText={(text) => onUpdate(item.id, { description: text })}
        placeholder="Item description"
        required
      />
      <View style={styles.row}>
        <TextInput
          label="Quantity"
          value={item.quantity.toString()}
          onChangeText={(text) => onUpdate(item.id, { quantity: Number(text) || 0 })}
          keyboardType="numeric"
          style={styles.quantityInput}
          required
        />
        <TextInput
          label="Unit Price"
          value={item.unitPrice.toString()}
          onChangeText={(text) => onUpdate(item.id, { unitPrice: Number(text) || 0 })}
          keyboardType="numeric"
          style={styles.priceInput}
          required
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  quantityInput: {
    flex: 1,
  },
  priceInput: {
    flex: 1,
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