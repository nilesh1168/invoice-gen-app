import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Constants
import { Colors } from "../constants/colors";
import { Currency } from "../constants/currencies";
import { LineItem } from "../constants/types";

// UI Components
import {
  TextInput,
  DatePicker,
  Button,
} from "./ui";

// ============================================================================
// Business Info Section Component
// ============================================================================

interface BusinessInfoSectionProps {
  displayName: string;
  address: string;
  onUpdate: (updates: { displayName?: string; address?: string }) => void;
}

export const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({
  displayName,
  address,
  onUpdate,
}) => {
  return (
    <View style={businessStyles.section}>
      <Text style={businessStyles.sectionTitle}>Business Information</Text>
      <TextInput
        label="Business Name"
        value={displayName}
        onChangeText={(text) => onUpdate({ displayName: text })}
        placeholder="Your business name"
        style={businessStyles.textInputStyle}
        required
      />
      <TextInput
        label="Address"
        value={address}
        onChangeText={(text) => onUpdate({ address: text })}
        placeholder="Business address"
        style={businessStyles.textInputStyle}
        multiline
        numberOfLines={3}
      />
    </View>
  );
};

const businessStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  textInputStyle: {
    backgroundColor: Colors.background,
  },
});

// ============================================================================
// Client Info Section Component
// ============================================================================

interface ClientInfoSectionProps {
  displayName: string;
  email: string;
  onUpdate: (updates: { displayName?: string; email?: string }) => void;
}

export const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  displayName,
  email,
  onUpdate,
}) => {
  return (
    <View style={clientStyles.section}>
      <Text style={clientStyles.sectionTitle}>Client Information</Text>
      <TextInput
        label="Client Name"
        value={displayName}
        onChangeText={(text) => onUpdate({ displayName: text })}
        placeholder="Client name"
        style={clientStyles.textInputStyle}
        required
      />
      <TextInput
        label="Client Email"
        value={email}
        onChangeText={(text) => onUpdate({ email: text })}
        placeholder="client@example.com"
        keyboardType="email-address"
        style={clientStyles.textInputStyle}
        required
      />
    </View>
  );
};

const clientStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  textInputStyle: {
    backgroundColor: Colors.background,
  },
});

// ============================================================================
// Invoice Details Section Component
// ============================================================================

interface InvoiceDetailsSectionProps {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: "INR" | "USD";
  onInvoiceNumberChange: (value: string) => void;
  onInvoiceDateChange: (date: Date) => void;
  onDueDateChange: (date: Date) => void;
  onCurrencyChange: (currency: "INR" | "USD") => void;
}

export const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
  currency,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onCurrencyChange,
}) => {
  return (
    <View style={detailsStyles.section}>
      <Text style={detailsStyles.sectionTitle}>Invoice Details</Text>
      <TextInput
        label="Invoice Number"
        value={invoiceNumber}
        onChangeText={onInvoiceNumberChange}
        placeholder="INV-001"
        style={detailsStyles.textInputStyle}
        required
      />
      <DatePicker
        label="Invoice Date"
        value={invoiceDate}
        onChange={onInvoiceDateChange}
        required
      />
      <DatePicker
        label="Due Date"
        value={dueDate}
        onChange={onDueDateChange}
        required
      />
      <View style={detailsStyles.currencyContainer}>
        <Text style={detailsStyles.currencyText}>Currency:</Text>
        <Button
          title="INR"
          onPress={() => onCurrencyChange("INR")}
          variant={currency === "INR" ? "outline" : "ghost"}
          style={detailsStyles.currencyButton}
        />
        <Button
          title="USD"
          onPress={() => onCurrencyChange("USD")}
          variant={currency === "USD" ? "outline" : "ghost"}
          style={detailsStyles.currencyButton}
        />
      </View>
    </View>
  );
};

const detailsStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
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
});

// ============================================================================
// Tax And Totals Component
// ============================================================================

interface TaxAndTotalsProps {
  taxPercentage: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: "INR" | "USD";
  onTaxPercentageChange: (value: number) => void;
}

export const TaxAndTotals: React.FC<TaxAndTotalsProps> = ({
  taxPercentage,
  subtotal,
  taxAmount,
  total,
  currency,
  onTaxPercentageChange,
}) => {
  return (
    <View style={taxStyles.section}>
      <Text style={taxStyles.sectionTitle}>Tax & Totals</Text>
      <TextInput
        label="Tax Percentage"
        value={taxPercentage.toString()}
        onChangeText={(text) => onTaxPercentageChange(Number(text) || 0)}
        keyboardType="numeric"
        placeholder="0"
        style={taxStyles.textInputStyle}
      />

      <View style={taxStyles.totalsContainer}>
        <View style={taxStyles.totalRow}>
          <Text style={taxStyles.totalLabel}>Subtotal:</Text>
          <Text style={taxStyles.totalValue}>
            {Currency[currency]} {subtotal.toFixed(2)}
          </Text>
        </View>
        <View style={taxStyles.totalRow}>
          <Text style={taxStyles.totalLabel}>Tax ({taxPercentage}%):</Text>
          <Text style={taxStyles.totalValue}>
            {Currency[currency]} {taxAmount.toFixed(2)}
          </Text>
        </View>
        <View style={[taxStyles.totalRow, taxStyles.finalTotal]}>
          <Text style={taxStyles.finalTotalLabel}>Total:</Text>
          <Text style={taxStyles.finalTotalValue}>
            {Currency[currency]} {total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const taxStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  textInputStyle: {
    backgroundColor: Colors.background,
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
});

// ============================================================================
// Line Item Input Component
// ============================================================================

interface LineItemInputProps {
  item: LineItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<LineItem>) => void;
  currency: string;
}

export const LineItemInput: React.FC<LineItemInputProps> = ({
  item,
  onRemove,
  onUpdate,
  currency,
}) => {
  return (
    <View style={lineItemStyles.lineItem}>
      <TextInput
        label="Description"
        value={item.description}
        onChangeText={(text) => onUpdate(item.id, { description: text })}
        placeholder="Item description"
        style={lineItemStyles.textInputStyle}
        required
      />
      <View style={lineItemStyles.row}>
        <TextInput
          label="Quantity"
          value={item.quantity.toString()}
          onChangeText={(text) => onUpdate(item.id, { quantity: Number(text) || 0 })}
          keyboardType="numeric"
          style={lineItemStyles.textInputStyle}
          required
        />
        <TextInput
          label="Unit Price"
          value={item.unitPrice.toString()}
          onChangeText={(text) => onUpdate(item.id, { unitPrice: Number(text) || 0 })}
          keyboardType="numeric"
          style={lineItemStyles.textInputStyle}
          required
        />
        <View style={lineItemStyles.totalContainer}>
          <Text style={lineItemStyles.totalLabel}>Total</Text>
          <Text style={lineItemStyles.totalValue}>
            {Currency[currency]} {item.total.toFixed(2)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={lineItemStyles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Text style={lineItemStyles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const lineItemStyles = StyleSheet.create({
  textInputStyle: {
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
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  totalContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  removeButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  removeButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
});
