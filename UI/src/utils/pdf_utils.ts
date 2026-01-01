import { printToFileAsync } from "expo-print";
import { Invoice } from "../constants/types";
import { Alert } from "react-native";
import { Currency } from "../constants/currencies";
import { numberToCurrencyWords } from "./numberToWord";

// Format date for display
const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const generateInvoiceHTML = (invoice: Invoice) => {
    // business detaails only on first page not on others
    const renderHeader = (showBillingSection: boolean = true) => `
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
             ${showBillingSection ? `
            <div class="separator"></div>
            <div class="billing-section">
                <div class="bill-to-section">
                    <h4>Bill To</h4>
                    <div class="client-details">
                        <div style="font-size: 24px; font-weight: 600; margin-bottom: 5px;">${invoice.client?.name}</div>
                        <div>${invoice.client?.email}</div>
                    </div>
                </div>
                <div class="business-address-section">
                    <div class="business-address">
                        <h4>${invoice.businessInfo.name}</h4>
                        <div>${invoice.businessInfo.address}</div>
                        <div>${invoice.businessInfo.phone}</div>
                        <div>${invoice.businessInfo.email}</div>
                    </div>
                </div>
            </div>
            ` : ''}
        </header>
`

    const renderTableHeader = () => `
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
`
    // TODO: create a string of html with first 8 lineitems
    let firstPageItems = invoice.lineItems.slice(0, 8);
    let firstPage = `
    <div class="invoice-page">
    ${renderHeader()}
    <main class="body">
      <table class="invoice-table">
        ${renderTableHeader()}
        <tbody>
        ${firstPageItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${Currency[invoice.currency]}${item.unitPrice.toFixed(2)}</td>
              <td>${Currency[invoice.currency]}${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        </table>
        ${invoice.lineItems.length <= 8 ? `
            <div class="totals-section">
              <div class="total-row subtotal">
                <span>Subtotal</span>
                <span>${Currency[invoice.currency]}${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row tax">
                ${invoice.taxPercentage > 0 ? `<span>Tax (${invoice.taxPercentage}%)</span>
                <span>${Currency[invoice.currency]}${invoice.taxAmount.toFixed(2)}</span>` : ''}
              </div>
              <div class="total-row final-total">
                <span>Total Amount Due</span>
                <span>${Currency[invoice.currency]}${invoice.total.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>In Words:</span>
                <span>${numberToCurrencyWords(invoice.total, invoice.currency)}</span>
              </div>
            </div>
            ${invoice.notes ? `
              <div class="notes-section">
                <h4>Notes</h4>
                <div class="notes-content">
                  ${invoice.notes}
                </div>
              </div>` : ''}
            ` : ''}
    </main>
            <footer class="footer">
            <div class="footer-content">
              <span class="copyright">&copy; 2025</span>
              <span class="company-name">InvoiceGen</span>
            </div>
          </footer>
    </div>
`;
    // Split line items into pages (estimate: 8 items per page for 600px)
    const itemsPerPage = 8;
    const pages = [];
    for (let i = 8; i < invoice.lineItems.length; i += itemsPerPage) {
        pages.push(invoice.lineItems.slice(i, i + itemsPerPage));
    }

    let bodyPagesHtml = '';
    pages.forEach((pageItems, pageIndex) => {
        bodyPagesHtml += `
      <div class="invoice-page">
        ${renderHeader(false)}
        <main class="body">
          <table class="invoice-table">
            ${renderTableHeader()}
            <tbody>
              ${pageItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${pageIndex === pages.length - 1 ? `
            <div class="totals-section">
              <div class="total-row subtotal">
                <span>Subtotal</span>
                <span>${Currency[invoice.currency]}${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row tax">
                ${invoice.taxPercentage > 0 ? `<span>Tax (${invoice.taxPercentage}%)</span>
                <span>${Currency[invoice.currency]}${invoice.taxAmount.toFixed(2)}</span>` : ''}
              </div>
              <div class="total-row final-total">
                <span>Total Amount Due</span>
                <span>${Currency[invoice.currency]}${invoice.total.toFixed(2)}</span>
                <span>In Words:</span>
                <span>${numberToCurrencyWords(invoice.total, invoice.currency)}</span>
              </div>
            </div>
            ${invoice.notes ? `
              <div class="notes-section">
                <h4>Notes</h4>
                <div class="notes-content">
                  ${invoice.notes}
                </div>
              </div>` : ''}
          ` : ''}
        </main>
        <footer class="footer">
            <div class="footer-content">
              <span class="copyright">&copy; 2025</span>
              <span class="company-name">InvoiceGen</span>
            </div>
          </footer>
      </div>
    `;
    });

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1024, initial-scale=1.0, user-scalable=yes">
    <title>Invoice Template</title>
    <style>
          .invoice-page {
        min-height: 1250px; 
        border: 2px solid #2C3E50;
        position: relative;
        }
         
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
            min-width: 1024px;
            overflow-x: auto;
        }

        .invoice-container {
            width: 800px;
            margin: 0 auto;
            background-color: #FFFFFF;
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
            background-color: #FFFFFF;
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            right: 0;
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
        ${firstPage}
        ${bodyPagesHtml}
    </div>
</body>
</html>
  `;
};


const generatePdf = async (invoice: Invoice) => {
    const htmlContent = generateInvoiceHTML(invoice);
    let uri;
    try {
        uri = await printToFileAsync({ html: htmlContent, base64: false, margins: { top: 30, bottom: 30, left: 10, right: 10 } });
    } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not generate PDF');
    }
    return uri;
};


export { generateInvoiceHTML, generatePdf }