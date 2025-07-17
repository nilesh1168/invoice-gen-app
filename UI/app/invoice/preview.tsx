import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Invoice } from '../../constants/types';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/ui/Toast';

export default function PreviewInvoiceScreen() {
  const { invoiceData } = useLocalSearchParams();
  const { toasts, showToast, hideToast } = useToast();
  
  const invoice: Invoice = JSON.parse(invoiceData as string);

  const handleEdit = () => {
    router.back();
  };

  const handleSend = () => {
    Alert.alert(
      'Send Invoice',
      `Send invoice to ${invoice.client?.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            // Here you would implement actual sending logic
            showToast('Invoice sent successfully!', 'success');
          }
        },
      ]
    );
  };

  const handleDownload = () => {
    // Here you would implement PDF generation and download
    showToast('Invoice downloaded!', 'success');
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Invoice Preview</Text>
          
          {/* Invoice Header */}
          <View style={styles.invoiceContainer}>
            <View style={styles.header}>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{invoice.businessInfo.name}</Text>
                <Text style={styles.businessAddress}>{invoice.businessInfo.address}</Text>
              </View>
              <View style={styles.invoiceInfo}>
                <Text style={styles.invoiceNumber}>Invoice #{invoice.invoiceNumber}</Text>
                <Text style={styles.invoiceDate}>Date: {formatDate(invoice.invoiceDate)}</Text>
                <Text style={styles.dueDate}>Due: {formatDate(invoice.dueDate)}</Text>
              </View>
            </View>

            {/* Client Info */}
            <View style={styles.clientSection}>
              <Text style={styles.sectionTitle}>Bill To:</Text>
              <Text style={styles.clientName}>{invoice.client?.name}</Text>
              <Text style={styles.clientEmail}>{invoice.client?.email}</Text>
            </View>

            {/* Line Items */}
            <View style={styles.itemsSection}>
              <View style={styles.itemsHeader}>
                <Text style={[styles.itemHeader, styles.descriptionHeader]}>Description</Text>
                <Text style={[styles.itemHeader, styles.quantityHeader]}>Qty</Text>
                <Text style={[styles.itemHeader, styles.priceHeader]}>Price</Text>
                <Text style={[styles.itemHeader, styles.totalHeader]}>Total</Text>
              </View>
              
              {invoice.lineItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={[styles.itemText, styles.descriptionText]}>{item.description}</Text>
                  <Text style={[styles.itemText, styles.quantityText]}>{item.quantity}</Text>
                  <Text style={[styles.itemText, styles.priceText]}>${item.unitPrice.toFixed(2)}</Text>
                  <Text style={[styles.itemText, styles.totalText]}>${item.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Totals */}
            <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
              </View>
              {invoice.taxPercentage > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax ({invoice.taxPercentage}%):</Text>
                  <Text style={styles.totalValue}>${invoice.taxAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.finalTotalRow]}>
                <Text style={styles.finalTotalLabel}>Total:</Text>
                <Text style={styles.finalTotalValue}>${invoice.total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Notes */}
            {invoice.notes && (
              <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Notes:</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Edit Invoice"
          onPress={handleEdit}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Download"
          onPress={handleDownload}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Send Invoice"
          onPress={handleSend}
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
  invoiceContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  businessAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  invoiceDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  clientSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  itemsSection: {
    marginBottom: 24,
  },
  itemsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 12,
    marginBottom: 16,
  },
  itemHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  descriptionHeader: {
    flex: 3,
  },
  quantityHeader: {
    flex: 1,
    textAlign: 'center',
  },
  priceHeader: {
    flex: 1,
    textAlign: 'right',
  },
  totalHeader: {
    flex: 1,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  descriptionText: {
    flex: 3,
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
  },
  priceText: {
    flex: 1,
    textAlign: 'right',
  },
  totalText: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  totalsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  finalTotalRow: {
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
  notesSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
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