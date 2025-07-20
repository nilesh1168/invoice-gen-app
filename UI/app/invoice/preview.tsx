import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Invoice } from '../../constants/types';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/ui/Toast';
import { printToFileAsync } from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
const { width } = Dimensions.get('window');

export default function PreviewInvoiceScreen() {
  const { invoiceData } = useLocalSearchParams();
  const { toasts, showToast, hideToast } = useToast();
  
  const invoice: Invoice = JSON.parse(invoiceData as string);

  const handleEdit = () => {
    router.back();
  };

  const handleSend = async () => {
    const recipientEmail = invoice.client?.email;

  if (!recipientEmail) {
    Alert.alert('Missing Email', 'No client email found for this invoice.');
    return;
  }
  Alert.alert(
    'Send Invoice',
    `Send invoice to ${invoice.client?.email}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: () => {
          Alert.alert('Invoice Sent');
        },
      },
    ]
  );
};

  const generateInvoiceHTML = (invoice: Invoice) => {
  return `
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

        .billing-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .bill-to-section {
            flex: 1;
        }

        .business-address-section {
            flex: 1;
            text-align: right;
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

        .business-address-section .business-address {
            text-align: right;
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
            
            .total-row.final-total {
                border-top: 3px solid #000000 !important;
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
            <div class="billing-section">
                <div class="bill-to-section">
                    <h4>Bill To</h4>
                    <div class="client-details">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">${invoice.client?.name}</div>
                        <div>${invoice.client?.email}</div>
                    </div>
                </div>
                <div class="business-address-section">
                    <div class="business-address">
                        <h4>Business Address</h4>
                        <div>${invoice.businessInfo.name}</div>
                        <div>${invoice.businessInfo.address}</div>
                        <div>${invoice.businessInfo.phone}</div>
                        <div>${invoice.businessInfo.email}</div>
                    </div>
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
                    <span>$${invoice.taxAmount.toFixed(2)}</span>` : ''}
                </div>
                <div class="total-row final-total">
                    <span>Total Amount Due</span>
                    <span>$${invoice.total.toFixed(2)}</span>
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
};

  const handleDownload = async () => {
  const htmlContent = generateInvoiceHTML(invoice)

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
      <View style={styles.invoiceContainer}>
        {/* Header Component */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>IG</Text>
              </View>
            </View>
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceNumber}>
                Invoice #{invoice.invoiceNumber}
              </Text>
              <View style={styles.dateInfo}>
                <Text style={styles.dateText}>
                  <Text style={styles.dateLabel}>Date:</Text> {formatDate(invoice.invoiceDate)}
                </Text>
                <Text style={styles.dateText}>
                  <Text style={styles.dateLabel}>Due:</Text> {formatDate(invoice.dueDate)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.billingSection}>
            <View style={styles.billToSection}>
              <Text style={styles.sectionTitle}>BILL TO</Text>
              <View style={styles.clientDetails}>
                <Text style={styles.clientName}>{invoice.client?.name}</Text>
                <Text style={styles.clientText}>{invoice.client?.email}</Text>
                {invoice.client?.address && (
                  <Text style={styles.clientText}>{invoice.client?.address}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.businessAddressSection}>
              <Text style={styles.businessAddressTitle}>BUSINESS ADDRESS</Text>
              <Text style={styles.businessAddressText}>{invoice.businessInfo.name}</Text>
              <Text style={styles.businessAddressText}>{invoice.businessInfo.address}</Text>
              <Text style={styles.businessAddressText}>{invoice.businessInfo.phone}</Text>
              <Text style={styles.businessAddressText}>{invoice.businessInfo.email}</Text>
            </View>
          </View>
        </View>

        {/* Body Component */}
        <View style={styles.body}>
          {/* Invoice Table */}
          <View style={styles.invoiceTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.descriptionHeader]}>
                DESCRIPTION
              </Text>
              <Text style={[styles.tableHeaderText, styles.qtyHeader]}>
                QTY
              </Text>
              <Text style={[styles.tableHeaderText, styles.priceHeader]}>
                UNIT PRICE
              </Text>
              <Text style={[styles.tableHeaderText, styles.totalHeaderRight]}>
                TOTAL
              </Text>
            </View>
            
            {invoice.lineItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.descriptionCell]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCell, styles.qtyCell]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.priceCell]}>
                  ${item.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.totalCellRight]}>
                  ${item.total.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
            </View>
            
            {invoice.taxPercentage > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({invoice.taxPercentage}%)</Text>
                <Text style={styles.totalValue}>${invoice.taxAmount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={[styles.totalRow, styles.finalTotalRow]}>
              <Text style={styles.finalTotalLabel}>TOTAL AMOUNT DUE</Text>
              <Text style={styles.finalTotalValue}>${invoice.total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Notes Section */}
          {invoice.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesSectionTitle}>NOTES</Text>
              <Text style={styles.notesContent}>{invoice.notes}</Text>
            </View>
          )}
        </View>

        {/* Footer Component */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.copyright}>© 2025</Text>
            <Text style={styles.companyName}>INVOICEGEN</Text>
          </View>
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
          disabled={true}
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
  scrollView: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  invoiceContainer: {
    width: Math.min(width - 40, 800),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2C3E50',
    margin: 20,
  },
  
  // Header Styles
  header: {
    padding: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#2C3E50',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logoSection: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#2C3E50',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  invoiceDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  invoiceNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 5,
  },
  dateLabel: {
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#2C3E50',
    marginVertical: 25,
  },
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billToSection: {
    flex: 1,
  },
  businessAddressSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clientDetails: {
    marginTop: 0,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  clientText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 21,
  },
  businessAddressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  businessAddressText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 21,
    textAlign: 'right',
  },
  
  // Body Styles
  body: {
    padding: 40,
  },
  invoiceTable: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionHeader: {
    flex: 3,
  },
  qtyHeader: {
    flex: 1,
    textAlign: 'center',
  },
  priceHeader: {
    flex: 1.5,
    textAlign: 'center',
  },
  totalHeaderRight: {
    flex: 1.5,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3E50',
  },
  tableCell: {
    fontSize: 14,
    color: '#2C3E50',
  },
  descriptionCell: {
    flex: 3,
  },
  qtyCell: {
    flex: 1,
    textAlign: 'center',
  },
  priceCell: {
    flex: 1.5,
    textAlign: 'center',
  },
  totalCellRight: {
    flex: 1.5,
    textAlign: 'right',
  },
  
  // Totals Styles
  totalsSection: {
    // borderTopWidth: 2,
    // borderTopColor: '#2C3E50',
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
  },
  finalTotalRow: {
    borderTopWidth: 3,
    borderTopColor: '#2C3E50',
    paddingTop: 15,
    marginTop: 15,
  },
  finalTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  
  // Notes Styles
  notesSection: {
    marginTop: 40,
    paddingVertical: 25,
    // borderWidth: 2,
    // borderColor: '#2C3E50',
    padding: 25,
  },
  notesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesContent: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 22,
  },
  
  // Footer Styles
  footer: {
    padding: 30,
    borderTopWidth: 2,
    borderTopColor: '#2C3E50',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyright: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  companyName: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   businessInfo: {
//     flex: 1,
//   },
//   businessName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   invoiceInfo: {
//     alignItems: 'flex-end',
//   },
//   invoiceDate: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: 4,
//   },
//   dueDate: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   clientSection: {
//     marginBottom: 32,
//   },
//   clientEmail: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   itemsSection: {
//     marginBottom: 24,
//   },
//   itemsHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.primary,
//     paddingBottom: 12,
//     marginBottom: 16,
//   },
//   itemHeader: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.textPrimary,
//   },
//   quantityHeader: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   totalHeader: {
//     flex: 1,
//     textAlign: 'right',
//   },
//   itemRow: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   itemText: {
//     fontSize: 14,
//     color: Colors.textPrimary,
//   },
//   descriptionText: {
//     flex: 3,
//   },
//   quantityText: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   priceText: {
//     flex: 1,
//     textAlign: 'right',
//   },
//   totalText: {
//     flex: 1,
//     textAlign: 'right',
//     fontWeight: '500',
//   },
//   notesText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     paddingTop: 8,
//     gap: 8,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },
//   button: {
//     flex: 1,
//   },
//   scrollView: {
//     backgroundColor: '#FFFFFF',
//   },
//   content: {
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   invoiceContainer: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 2,
//     borderColor: '#2C3E50',
//   },
  
//   // Header Styles
//   header: {
//     padding: 40,
//     borderBottomWidth: 2,
//     borderBottomColor: '#2C3E50',
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 30,
//   },
//   logoSection: {
//     flex: 1,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 3,
//     borderColor: '#2C3E50',
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//   },
//   logoText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//   },
//   businessAddress: {
//     marginTop: 0,
//   },
//   businessAddressTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   businessAddressText: {
//     fontSize: 14,
//     color: '#2C3E50',
//     lineHeight: 21,
//   },
//   invoiceDetails: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   invoiceNumber: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginBottom: 10,
//     textTransform: 'uppercase',
//   },
//   dateInfo: {
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#2C3E50',
//     marginBottom: 5,
//   },
//   dateLabel: {
//     fontWeight: '700',
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#2C3E50',
//     marginVertical: 25,
//   },
//   clientInfo: {
//     marginTop: 0,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 10,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   clientDetails: {
//     marginTop: 0,
//   },
//   clientName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginBottom: 5,
//   },
//   clientText: {
//     fontSize: 14,
//     color: '#2C3E50',
//     lineHeight: 21,
//   },
  
//   // Body Styles
//   body: {
//     padding: 40,
//   },
//   invoiceTable: {
//     marginBottom: 30,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#2C3E50',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//   },
//   tableHeaderText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   descriptionHeader: {
//     flex: 3,
//   },
//   qtyHeader: {
//     flex: 1,
//   },
//   priceHeader: {
//     flex: 1.5,
//   },
//   totalHeaderRight: {
//     flex: 1.5,
//     textAlign: 'right',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#2C3E50',
//   },
//   tableCell: {
//     fontSize: 14,
//     color: '#2C3E50',
//   },
//   descriptionCell: {
//     flex: 3,
//   },
//   qtyCell: {
//     flex: 1,
//   },
//   priceCell: {
//     flex: 1.5,
//   },
//   totalCellRight: {
//     flex: 1.5,
//     textAlign: 'right',
//   },
  
//   // Totals Styles
//   totalsSection: {
//     borderTopWidth: 2,
//     borderTopColor: '#2C3E50',
//     paddingTop: 20,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   totalLabel: {
//     fontSize: 15,
//     color: '#2C3E50',
//     fontWeight: '500',
//   },
//   totalValue: {
//     fontSize: 15,
//     color: '#2C3E50',
//     fontWeight: '500',
//   },
//   finalTotalRow: {
//     borderTopWidth: 3,
//     borderTopColor: '#2C3E50',
//     paddingTop: 15,
//     marginTop: 15,
//   },
//   finalTotalLabel: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   finalTotalValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//   },
  
//   // Notes Styles
//   notesSection: {
//     marginTop: 40,
//     paddingVertical: 25,
//   },
//   notesSectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 15,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   notesContent: {
//     fontSize: 14,
//     color: '#2C3E50',
//     lineHeight: 22,
//   },
  
//   // Footer Styles
//   footer: {
//     padding: 30,
//     borderTopWidth: 2,
//     borderTopColor: '#2C3E50',
//     alignItems: 'center',
//   },
//   footerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   copyright: {
//     fontSize: 14,
//     color: '#2C3E50',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   companyName: {
//     fontSize: 14,
//     color: '#2C3E50',
//     fontWeight: '700',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   billingSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginTop: 0,
//   },
//   billToSection: {
//     flex: 1,
//   },
//   businessAddressSection: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
// });