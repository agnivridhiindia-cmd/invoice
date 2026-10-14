# Universal Invoice Studio (Standalone Web Application)

A modern, portable, client-free invoice generation web application.

---

## 🌟 Key Features

1. **No Explicit Client Selection Required**:
   - **Free-form Client Entry**: Type any buyer name, company, address, GSTIN, PAN, and contact details directly on the invoice without needing a pre-registered client database.
   - **1-Click "Cash Sale" Button**: Fills standard walk-in / retail counter customer details in a single click.
   - **Smart Text Parser**: Paste any unstructured address block, WhatsApp message, or email signature to automatically extract Company Name, GSTIN, PAN, Phone, Email, and State.
   - **Recent Buyers Memory**: Frequently billed recipients are remembered in browser `localStorage` as quick 1-click chip buttons.

2. **All Types of Invoices Supported**:
   - **GST Tax Invoice (B2B & B2C)**: Real-time tax determination (Intra-state CGST + SGST vs Inter-state IGST based on State/Place of Supply codes).
   - **Proforma Invoice**: Advance quotation and milestone billing.
   - **Commercial / Export Invoice**: Multi-currency support (₹ INR, $ USD, € EUR, £ GBP, AED, etc.), Letter of Undertaking (LUT) reference, Port of Loading, and Country of Destination.
   - **Quotation / Estimate**: Formal proposals with valid-until dates.
   - **Bill of Supply**: For composition dealers or exempt/nil-rated goods.
   - **Cash Memo / Payment Receipt**: Immediate settlement receipts.
   - **Delivery Challan**: Material movement and dispatch documentation.

3. **Dynamic Live Features**:
   - **Instant Live UPI QR Code**: Enter a UPI ID and the app generates a scannable QR code on the invoice for instant payments via GPay, PhonePe, Paytm, etc.
   - **Auto "Amount in Words"**: Indian numbering format (Crores/Lakhs) and International format (Millions/Billions).
   - **Full A4 Vector Print & PDF Engine**: Pixel-perfect `@media print` rules ensure clean, margin-accurate PDF generation without browser clutter.
   - **Multiple Themes**: AgniVridhi Official (Crimson/Red), Modern Executive (Indigo), Minimalist Monochrome (High contrast), and Emerald Corporate.
   - **Local Storage Drafts**: Save and restore invoice drafts locally without any backend server.

---

## 🚀 How to Run Locally

Navigate into this folder in your terminal:

```bash
cd standalone-invoice-app
npm install
npm run dev
```

Open your browser at:
```
http://127.0.0.1:5174/
```

To create a production static build:
```bash
npm run build
```

---

## 📦 How to Move or Remove this Application

This folder is **100% self-contained**:
- It has **zero dependencies** on the parent `agnicrm` codebase.
- You can **cut and paste** `standalone-invoice-app` anywhere on your computer (e.g., to your Desktop, another project, or an isolated Git repository).
- If you no longer need it, simply **delete** this `standalone-invoice-app` folder. It will not affect `agnicrm` in any way.
