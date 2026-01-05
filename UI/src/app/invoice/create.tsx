import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Constants
import { Colors } from "../../constants/colors";
import { LineItem } from "../../constants/types";

// UI Components
import { Container, Button, TextInput, Toast } from "../../components/ui";

// Invoice Components
import {
  LineItemInput,
  BusinessInfoSection,
  ClientInfoSection,
  InvoiceDetailsSection,
  TaxAndTotals,
} from "../../components/invoice";

// Hooks
import { useInvoice } from "../../hooks/useInvoice";
import { useToast } from "../../hooks/useToast";
import { useAuthContext } from "../../context/AuthContext";

// Utils
import { validateInvoice } from "../../utils/validation";

export default function CreateInvoiceScreen() {
  const { loading, userDetails, logout } = useAuthContext();
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

  // Helper functions to reduce repetitive object reconstruction
  const updateBusinessInfo = (updates: Partial<typeof invoice.businessInfo>) => {
    updateInvoice({
      businessInfo: {
        ...invoice.businessInfo,
        ...updates,
      },
    });
  };

  const updateClient = (updates: Partial<typeof invoice.client>) => {
    if (invoice.client) {
      updateInvoice({
        client: {
          ...invoice.client,
          ...updates,
        },
      });
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !userDetails) {
      router.replace("/");
    }
  }, [userDetails, loading]);

  // Prefill business information with user details
  useEffect(() => {
    if (userDetails && !invoice.businessInfo.uid && userDetails.uid) {
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

  // Recalculate totals when line items or tax percentage changes
  useEffect(() => {
    recalculateInvoice();
  }, [invoice.lineItems, invoice.taxPercentage, recalculateInvoice]);

  const handlePreview = useCallback(() => {
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      showToast(errors[0], "error");
      return;
    }

    router.push({
      pathname: "/invoice/preview",
      params: { invoiceData: JSON.stringify(invoice) },
    });
  }, [invoice, showToast]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Cancel Invoice",
      "Are you sure you want to cancel? All changes will be lost.",
      [
        { text: "Continue Editing", style: "cancel" },
        { text: "Cancel Invoice", style: "destructive", onPress: resetInvoice },
      ]
    );
  }, [resetInvoice]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  }, [logout]);

  const renderLineItem = useCallback(({ item }: { item: LineItem }) => (
    <LineItemInput
      item={item}
      onUpdate={updateLineItem}
      onRemove={removeLineItem}
      currency={invoice.currency}
    />
  ), [updateLineItem, removeLineItem, invoice.currency]);

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
            <>
              <BusinessInfoSection
                displayName={invoice.businessInfo.displayName}
                address={invoice.businessInfo.address}
                onUpdate={updateBusinessInfo}
              />

              <ClientInfoSection
                displayName={invoice.client?.displayName || ""}
                email={invoice.client?.email || ""}
                onUpdate={updateClient}
              />

              <InvoiceDetailsSection
                invoiceNumber={invoice.invoiceNumber}
                invoiceDate={invoice.invoiceDate}
                dueDate={invoice.dueDate}
                currency={invoice.currency as "INR" | "USD"}
                onInvoiceNumberChange={(text) => updateInvoice({ invoiceNumber: text })}
                onInvoiceDateChange={(date) => updateInvoice({ invoiceDate: date })}
                onDueDateChange={(date) => updateInvoice({ dueDate: date })}
                onCurrencyChange={(currency) => updateInvoice({ currency })}
              />

              <Text style={styles.title}>Line Items</Text>
            </>
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
              <TaxAndTotals
                taxPercentage={invoice.taxPercentage}
                subtotal={invoice.subtotal}
                taxAmount={invoice.taxAmount}
                total={invoice.total}
                currency={invoice.currency as "INR" | "USD"}
                onTaxPercentageChange={(value) => updateInvoice({ taxPercentage: value })}
              />
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
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
