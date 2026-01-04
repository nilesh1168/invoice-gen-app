import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";
import { Button } from "../../components/ui/Button";
import { TextInput } from "../../components/ui/TextInput";
import { DatePicker } from "../../components/ui/DatePicker";
import { LineItemInput } from "../../components/invoice/LineItemInput";
import { useInvoice } from "../../hooks/useInvoice";
import { useToast } from "../../hooks/useToast";
import { validateInvoice } from "../../utils/validation";
import { Toast } from "../../components/ui/Toast";
import { LineItem } from "../../constants/types";
import { Container } from "../../components/ui/Container";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Currency } from "../../constants/currencies";
import { useAuthContext } from "../../context/AuthContext";

export default function CreateInvoiceScreen() {
  const { user, loading, userDetails, logout } = useAuthContext();
  const navigation = useNavigation();
  const {
    invoice,
    updateInvoice,
    addLineItem,
    removeLineItem,
    updateLineItem,
    recalculateInvoice,
    resetInvoice,
  } = useInvoice();

  const insets = useSafeAreaInsets();
  const { toasts, showToast, hideToast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading]);

  // Prefill business information with user details
  useEffect(() => {
    if (userDetails && !invoice.businessInfo.uid) {
      updateInvoice({
        businessInfo: {
          uid: userDetails.uid,
          displayName: userDetails.displayName,
          address: userDetails.address || "",
          phoneNumber: userDetails.phoneNumber,
          email: userDetails.email,
          logo: userDetails.logo,
        },
      });
    }
  }, [userDetails]);

  useEffect(() => {
    recalculateInvoice();
  }, [invoice.lineItems, invoice.taxPercentage]);

  const handlePreview = () => {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      showToast(errors[0], "error");
      return;
    }

    router.push({
      pathname: "/invoice/preview",
      params: { invoiceData: JSON.stringify(invoice) },
    });
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Invoice",
      "Are you sure you want to cancel? All changes will be lost.",
      [
        { text: "Continue Editing", style: "cancel" },
        { text: "Cancel Invoice", style: "destructive", onPress: resetInvoice },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  };

  const renderLineItem = ({ item }: { item: LineItem }) => (
    <LineItemInput
      item={item}
      onUpdate={updateLineItem}
      onRemove={removeLineItem}
      currency={invoice.currency}
    />
  );

  const bottomOffset = insets.bottom + 62;

  if (loading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <FlatList
          data={invoice.lineItems}
          renderItem={renderLineItem}
          renderScrollComponent={(props) => (
            <KeyboardAwareScrollView bottomOffset={bottomOffset} {...props} />
          )}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Information</Text>
              <TextInput
                label="Business Name"
                value={invoice.businessInfo.displayName}
                onChangeText={(text) =>
                  updateInvoice({
                    businessInfo: {
                      uid: invoice.businessInfo?.uid || "",
                      logo: invoice.businessInfo?.logo || "",
                      displayName: invoice.businessInfo?.displayName || "",
                      email: text,
                      phoneNumber: invoice.businessInfo?.phoneNumber,
                      address: invoice.businessInfo?.address || "",
                    },
                  })
                }
                placeholder="Your business name"
                style={styles.textInputStyle}
                required
              />
              <TextInput
                label="Address"
                value={invoice.businessInfo.address}
                onChangeText={(text) =>
                  updateInvoice({
                    businessInfo: {
                      uid: invoice.businessInfo?.uid || "",
                      logo: invoice.businessInfo?.logo || "",
                      displayName: invoice.businessInfo?.displayName || "",
                      email: text,
                      phoneNumber: invoice.businessInfo?.phoneNumber,
                      address: invoice.businessInfo?.address || "",
                    },
                  })
                }
                placeholder="Business address"
                style={styles.textInputStyle}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.sectionTitle}>Client Information</Text>
              <TextInput
                label="Client Name"
                value={invoice.client?.displayName || ""}
                onChangeText={(text) =>
                  updateInvoice({
                    client: {
                      uid: invoice.client?.uid || "",
                      logo: invoice.client?.logo || "",
                      displayName: invoice.client?.displayName || "",
                      email: text,
                      phoneNumber: invoice.client?.phoneNumber,
                      address: invoice.client?.address || "",
                    },
                  })
                }
                placeholder="Client name"
                style={styles.textInputStyle}
                required
              />
              <TextInput
                label="Client Email"
                value={invoice.client?.email || ""}
                onChangeText={(text) =>
                  updateInvoice({
                    client: {
                      uid: invoice.client?.uid || "",
                      logo: invoice.client?.logo || "",
                      displayName: invoice.client?.displayName || "",
                      email: text,
                      phoneNumber: invoice.client?.phoneNumber,
                      address: invoice.client?.address || "",
                    },
                  })
                }
                placeholder="client@example.com"
                keyboardType="email-address"
                style={styles.textInputStyle}
                required
              />
              <Text style={styles.sectionTitle}>Invoice Details</Text>
              <TextInput
                label="Invoice Number"
                value={invoice.invoiceNumber}
                onChangeText={(text) => updateInvoice({ invoiceNumber: text })}
                placeholder="INV-001"
                style={styles.textInputStyle}
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
              {/* add 2 buttons to select the currency (INR and USD) with INR as default selected. Use the app color theme */}
              <View style={styles.currencyContainer}>
                <Text style={styles.currencyText}>Currency:</Text>
                <Button
                  title="INR"
                  onPress={() => updateInvoice({ currency: "INR" })}
                  variant={invoice.currency === "INR" ? "outline" : "ghost"}
                  style={styles.currencyButton}
                />
                <Button
                  title="USD"
                  onPress={() => updateInvoice({ currency: "USD" })}
                  variant={invoice.currency === "USD" ? "outline" : "ghost"}
                  style={styles.currencyButton}
                />
              </View>

              <Text style={styles.title}>Line Items</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.section}>
              <View style={styles.section}>
                <Button
                  title="+ Add Item"
                  onPress={addLineItem}
                  variant="outline"
                  style={styles.addButton}
                />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tax & Totals</Text>
                <TextInput
                  label="Tax Percentage"
                  value={invoice.taxPercentage.toString()}
                  onChangeText={(text) =>
                    updateInvoice({ taxPercentage: Number(text) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  style={styles.textInputStyle}
                />

                <View style={styles.totalsContainer}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>
                      {Currency[invoice.currency]} {invoice.subtotal.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>
                      Tax ({invoice.taxPercentage}%):
                    </Text>
                    <Text style={styles.totalValue}>
                      {Currency[invoice.currency]}{" "}
                      {invoice.taxAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.totalRow, styles.finalTotal]}>
                    <Text style={styles.finalTotalLabel}>Total:</Text>
                    <Text style={styles.finalTotalValue}>
                      {Currency[invoice.currency]} {invoice.total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <TextInput
                  label="Notes / Terms"
                  value={invoice.notes}
                  onChangeText={(text) => updateInvoice({ notes: text })}
                  placeholder="Payment terms, additional notes..."
                  numberOfLines={4}
                  style={styles.textInputStyle}
                  multiline
                />
              </View>
            </View>
          }
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="error"
            style={styles.button}
          />
          <Button
            title="Back"
            onPress={() => router.back()}
            variant="ghost"
            disabled={!navigation.canGoBack()}
            style={styles.button}
          />
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="error"
            style={styles.cancelBtn}
          />
          <Button
            title="Preview"
            onPress={handlePreview}
            style={styles.button}
          />
        </View>

        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onHide={hideToast} />
        ))}
      </Container>
      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    backgroundColor: Colors.background,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    alignSelf: "center",
  },
  currencyContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  currencyButton: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "500",
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
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cancelBtn: {
    flex: 1,
  },
  button: {
    flex: 1,
  },
  addButton: {
    marginTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
