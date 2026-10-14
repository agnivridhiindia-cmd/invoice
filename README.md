# AgniVridhi Proforma Studio (Standalone Web Application)

A modern, portable, client-free Proforma invoice generation web application for AgniVridhi India.

---

## 🌟 Key Features

1. **Dedicated Proforma Invoicing**:
   - Generates official AgniVridhi India Proforma Invoices with PI prefix (`PI-YYYYMMDD-XXX`).
   - Intra-state (CGST + SGST) vs Inter-state (IGST) tax calculation based on Place of Supply.
   - Dynamic multi-service row items with individual toggles for "Show on Invoice" and "Include in Total".
   - Optional toggle for official Authorised Signatory Stamp.

2. **No Explicit Client Selection Required**:
   - **Free-form Client Entry**: Type any buyer name, company, address, GSTIN, PAN, and contact details directly on the invoice without needing a pre-registered client database.
   - **Auto Place of Supply**: Automatically detects Place of Supply and GST code from client GSTIN or State.

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
