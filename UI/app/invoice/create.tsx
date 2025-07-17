import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { DatePicker } from '../../components/ui/DatePicker';
import { LineItemList } from '../../components/invoice/LineItemList';
import { useInvoice } from '../../hooks/useInvoice';
import { useToast } from '../../hooks/useToast';
import { validateInvoice } from '../../utils/validation';
import { Toast } from '../../components/ui/Toast';

export default function CreateInvoiceScreen() {
  const {
    invoice,
    updateInvoice,
    addLineItem,
    removeLineItem,
    updateLineItem,
    recalculateInvoice,
    resetInvoice,
  } = useInvoice();

  const { toasts, showToast, hideToast } = useToast();

  useEffect(() => {
    recalculateInvoice();
  }, [invoice.lineItems, invoice.taxPercentage]);

  const handlePreview = () => {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }
    
    router.push({
      pathname: '/invoice/preview',
      params: { invoiceData: JSON.stringify(invoice) },
    });
  };

  const handleSaveDraft = () => {
    updateInvoice({ isDraft: true });
    showToast('Draft saved successfully', 'success');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Invoice',
      'Are you sure you want to cancel? All changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel Invoice', style: 'destructive', onPress: resetInvoice },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Invoice</Text>
          
          {/* Business Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            <TextInput
              label="Business Name"
              value={invoice.businessInfo.name}
              onChangeText={(text) => updateInvoice({
                businessInfo: { ...invoice.businessInfo, name: text }
              })}
              placeholder="Your business name"
              required
            />
            <TextInput
              label="Address"
              value={invoice.businessInfo.address}
              onChangeText={(text) => updateInvoice({
                businessInfo: { ...invoice.businessInfo, address: text }
              })}
              placeholder="Business address"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Client Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            <TextInput
              label="Client Name"
              value={invoice.client?.name || ''}
              onChangeText={(text) => updateInvoice({
                client: { ...invoice.client, name: text, id: invoice.client?.id || Date.now().toString(), email: invoice.client?.email || '' }
              })}
              placeholder="Client name"
              required
            />
            <TextInput
              label="Client Email"
              value={invoice.client?.email || ''}
              onChangeText={(text) => updateInvoice({
                client: { ...invoice.client, email: text, id: invoice.client?.id || Date.now().toString(), name: invoice.client?.name || '' }
              })}
              placeholder="client@example.com"
              keyboardType="email-address"
              required
            />
          </View>

          {/* Invoice Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <TextInput
              label="Invoice Number"
              value={invoice.invoiceNumber}
              onChangeText={(text) => updateInvoice({ invoiceNumber: text })}
              placeholder="INV-001"
              required
            />
            <DatePicker
              label="Invoice Date"
              value={invoice.invoiceDate}
              onChange={(date) => updateInvoice({ invoiceDate: date })}
              required
            />
            <DatePicker
              label="Due Date"
              value={invoice.dueDate}
              onChange={(date) => updateInvoice({ dueDate: date })}
              required
            />
          </View>

          {/* Line Items */}
          <LineItemList
            lineItems={invoice.lineItems}
            onAddItem={addLineItem}
            onRemoveItem={removeLineItem}
            onUpdateItem={updateLineItem}
          />

          {/* Tax and Totals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tax & Totals</Text>
            <TextInput
              label="Tax Percentage"
              value={invoice.taxPercentage.toString()}
              onChangeText={(text) => updateInvoice({ taxPercentage: Number(text) || 0 })}
              keyboardType="numeric"
              placeholder="0"
            />
            
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({invoice.taxPercentage}%):</Text>
                <Text style={styles.totalValue}>${invoice.taxAmount.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalRow, styles.finalTotal]}>
                <Text style={styles.finalTotalLabel}>Total:</Text>
                <Text style={styles.finalTotalValue}>${invoice.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <TextInput
              label="Notes / Terms"
              value={invoice.notes}
              onChangeText={(text) => updateInvoice({ notes: text })}
              placeholder="Payment terms, additional notes..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="ghost"
          style={styles.button}
        />
        <Button
          title="Save Draft"
          onPress={handleSaveDraft}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Preview"
          onPress={handlePreview}
          style={styles.button}
        />
      </View>

      {/* Toast Messages */}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onHide={hideToast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  totalsContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  button: {
    flex: 1,
  },
});