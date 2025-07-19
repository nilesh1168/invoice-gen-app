import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Invoice } from '../../constants/types';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/ui/Toast';
import { printToFileAsync } from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

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

  const handleDownload = async () => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1024, initial-scale=1.0, user-scalable=yes">
    <title>Invoice Template</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #FFFFFF;
            color: #2C3E50;
            line-height: 1.6;
            padding: 20px;
            min-width: 1024px;
            overflow-x: auto;
        }

        .invoice-container {
            width: 800px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border: 2px solid #2C3E50;
        }

        /* Header Component */
        .header {
            padding: 40px;
            color: #2C3E50;
            position: relative;
            border-bottom: 2px solid #2C3E50;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
        }

        .logo-section {
            flex: 1;
        }

        .logo {
            width: 60px;
            height: 60px;
            background-color: #FFFFFF;
            border: 3px solid #2C3E50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #2C3E50;
            margin-bottom: 15px;
        }

        .business-address {
            font-size: 14px;
            line-height: 1.5;
            color: #2C3E50;
        }

        .business-address h4 {
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: 700;
            color: #2C3E50;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .invoice-details {
            text-align: right;
            flex: 1;
        }

        .invoice-number {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2C3E50;
            text-transform: uppercase;
        }

        .date-info {
            font-size: 14px;
            color: #2C3E50;
        }

        .date-info div {
            margin-bottom: 5px;
        }

        .date-info strong {
            font-weight: 700;
        }

        .separator {
            height: 1px;
            background-color: #2C3E50;
            margin: 25px 0;
        }

        .client-info h4 {
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 700;
            color: #2C3E50;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .client-details {
            font-size: 14px;
            color: #2C3E50;
        }

        .client-details > div:first-child {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 5px;
        }

        /* Body Component */
        .body {
            padding: 40px;
            background-color: #FFFFFF;
        }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background-color: #FFFFFF;
        }

        .invoice-table thead {
            background-color: #2C3E50;
            color: #FFFFFF;
        }

        .invoice-table th {
            padding: 15px;
            text-align: left;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #FFFFFF;
        }

        .invoice-table th:last-child,
        .invoice-table td:last-child {
            text-align: right;
        }

        .invoice-table td {
            padding: 15px;
            border-bottom: 1px solid #2C3E50;
            font-size: 14px;
            color: #2C3E50;
        }

        .invoice-table tbody tr:last-child td {
            border-bottom: none;
        }

        .totals-section {
            border-top: 2px solid #2C3E50;
            padding-top: 20px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            font-size: 15px;
            color: #2C3E50;
        }

        .total-row.subtotal,
        .total-row.tax {
            font-weight: 500;
        }

        .total-row.final-total {
            font-size: 20px;
            font-weight: bold;
            color: #2C3E50;
            border-top: 3px solid #2C3E50;
            padding-top: 15px;
            margin-top: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .notes-section {
            margin-top: 40px;
            padding: 25px;
            border: 2px solid #2C3E50;
        }

        .notes-section h4 {
            color: #2C3E50;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .notes-content {
            color: #2C3E50;
            font-size: 14px;
            line-height: 1.6;
        }

        /* Footer Component */
        .footer {
            color: #2C3E50;
            text-align: center;
            padding: 30px;
            font-size: 14px;
            border-top: 2px solid #2C3E50;
            background-color: #FFFFFF;
        }

        .footer-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .copyright {
            font-size: 14px;
        }

        .company-name {
            font-weight: 700;
        }

        /* Print optimizations */
        @media print {
            body {
                background-color: #FFFFFF !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            .invoice-container {
                border: 2px solid #000000 !important;
            }
            
            .header {
                border-bottom: 2px solid #000000 !important;
            }
            
            .logo {
                border: 3px solid #000000 !important;
                color: #000000 !important;
            }
            
            .separator {
                background-color: #000000 !important;
            }
            
            .invoice-table {
                
            }
            
            .invoice-table thead {
                background-color: #000000 !important;
                color: #FFFFFF !important;
            }
            
            .invoice-table td {
                border-bottom: 1px solid #000000 !important;
            }
            
            .totals-section {
                border-top: 2px solid #000000 !important;
            }
            
            .total-row.final-total {
                border-top: 3px solid #000000 !important;
            }
            
            .notes-section {
                border: 2px solid #000000 !important;
            }
            
            .footer {
                border-top: 2px solid #000000 !important;
            }
            
            * {
                color: #000000 !important;
            }
            
            .invoice-table thead th {
                color: #FFFFFF !important;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header Component -->
        <header class="header">
            <div class="header-top">
                <div class="logo-section">
                    <div class="logo">IG</div>
                    <div class="business-address">
                        <h4>Business Address</h4>
                        <div>123 Business Street</div>
                        <div>Suite 456</div>
                        <div>Business City, BC 12345</div>
                        <div>Phone: (555) 123-4567</div>
                        <div>Email: contact@business.com</div>
                    </div>
                </div>
                <div class="invoice-details">
                     <div class="invoice-number">Invoice #${invoice.invoiceNumber}</div>
                    <div class="date-info">
                        <div><strong>Date:</strong> ${formatDate(invoice.invoiceDate)}</div>
                        <div><strong>Due:</strong> ${formatDate(invoice.dueDate)}</div>
                    </div>
                </div>
            </div>
            <div class="separator"></div>
            <div class="client-info">
                <h4>Bill To</h4>
                <div class="client-details">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">${invoice.client?.name}</div>
                    <div>${invoice.client?.email}</div>
                </div>
            </div>
        </header>

        <!-- Body Component -->
        <main class="body">
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
                </tbody>
            </table>

            <div class="totals-section">
                <div class="total-row subtotal">
                    <span>Subtotal</span>
                    <span>$${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row tax">
                    ${invoice.taxPercentage > 0 ? `<span>Tax (${invoice.taxPercentage}%)</span>
                    <span>$${invoice.total.toFixed(2)}</span>` : ''}
                </div>
                <div class="total-row final-total">
                    <span>Total Amount Due</span>
                    <span>$9,548.00</span>
                </div>
            </div>

            ${invoice.notes ? `
            <div class="notes-section">
                <h4>Notes</h4>
                <div class="notes-content">
                    ${invoice.notes}
                </div>
            </div>` : ''}
        </main>

        <!-- Footer Component -->
        <footer class="footer">
            <div class="footer-content">
                <span class="copyright">&copy; 2025</span>
                <span class="company-name">InvoiceGen</span>
            </div>
        </footer>
    </div>
</body>
</html>
  `;

  try {
    const { uri } = await printToFileAsync({ html: htmlContent, base64: false });

    showToast('Invoice downloaded!', 'success');

    if (await isAvailableAsync()) {
      await shareAsync(uri);
    } else {
      Alert.alert('PDF Generated', `File saved at: ${uri}`);
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Could not generate PDF');
  }
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