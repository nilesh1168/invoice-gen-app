import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Invoice } from '../../constants/types';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/ui/Toast';
import { printToFileAsync } from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import { generateInvoiceHTML } from '../../utils/pdf_utils';
const { width } = Dimensions.get('window');

export default function PreviewInvoiceScreen() {
  const { invoiceData } = useLocalSearchParams();
  const { toasts, showToast, hideToast } = useToast();

  const invoice: Invoice = JSON.parse(invoiceData as string);

  const handleSend = async () => {
    // TODO: Implement email sending functionality
  };

  // Handle PDF generation and sharing
  const handleDownload = async () => {
    const htmlContent = generateInvoiceHTML(invoice)

    try {
      const { uri } = await printToFileAsync({ html: htmlContent, base64: false });

      if (await isAvailableAsync()) {
        await shareAsync(uri).then(() => {
            Alert.alert('Success', 'Invoice downloaded successfully');
        })
      } else {
        // File shared at a temperary location, you might want to move it to a permanent location
        showToast(`Invoice generated: Invoice saved at ${uri}`, 'success');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not generate Invoice');
    }
  };



  return (
    <>
      <WebView
        originWhitelist={['*']}
        source={{ html: generateInvoiceHTML(invoice) }}
        style={{ flex: 1, backgroundColor: '#fff' }}
        automaticallyAdjustContentInsets={false}
        scalesPageToFit={true}
      />
      <View style={styles.buttonContainer}>
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
      </>
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