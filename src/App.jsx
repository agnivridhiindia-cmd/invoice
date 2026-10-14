import React, { useState } from "react";
import InvoiceForm from "./components/InvoiceForm.jsx";
import OfficialInvoicePreview from "./components/OfficialInvoicePreview.jsx";
import { Printer, Columns2, Edit3, FileCheck2 } from "lucide-react";
import { INVOICE_TYPES, AGNIVRIDHI_SELLER } from "./utils/constants.js";

const DEFAULT_INVOICE = {
  type: "Proforma Invoice",
  invoiceNo: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-001`,
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  clientName: "",
  contactPerson: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  gstin: "",
  pan: "",
  email: "",
  mobile: "",
  services: [
    {
      id: "srv_1",
      description: "Consultancy Services",
      hsnSac: "998311",
      gstPercent: 18,
      quantity: 1,
      rate: 10000,
      showOnInvoice: true,
      includeInTotal: true,
      chargePayment: true
    }
  ],
  placeOfSupply: "Telangana (36)",
  notes: ""
};

export default function App() {
  const [invoice, setInvoice] = useState(DEFAULT_INVOICE);
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'edit' | 'preview'

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("Reset invoice form to blank?")) {
      const now = new Date();
      const freshNo = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`;
      setInvoice({
        type: "Proforma Invoice",
        invoiceNo: freshNo,
        issueDate: now.toISOString().split("T")[0],
        dueDate: "",
        clientName: "",
        contactPerson: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstin: "",
        pan: "",
        email: "",
        mobile: "",
        services: [
          {
            id: "srv_1",
            description: "",
            hsnSac: "998311",
            gstPercent: 18,
            quantity: 1,
            rate: 0,
            showOnInvoice: true,
            includeInTotal: true,
            chargePayment: true
          }
        ],
        placeOfSupply: "Telangana (36)",
        notes: ""
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="navbar-container no-print">
        <div className="navbar-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-gray-900 tracking-tight text-base">
                  AgniVridhi Invoice Studio
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Standalone
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Proforma, Tax & GST Invoices with multi-service dynamic billing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center bg-gray-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "split" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Columns2 size={13} />
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "edit" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Edit3 size={13} />
                Form
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === "preview" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileCheck2 size={13} />
                A4 PDF
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary text-xs"
            >
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-3 sm:p-6 max-w-[1700px] w-full mx-auto">
        <div
          className={`grid gap-6 ${
            viewMode === "split"
              ? "grid-cols-1 lg:grid-cols-12"
              : viewMode === "edit"
              ? "grid-cols-1 max-w-2xl mx-auto"
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}
        >
          {/* Left Column: The Invoice Details Form */}
          {(viewMode === "split" || viewMode === "edit") && (
            <div
              className={viewMode === "split" ? "lg:col-span-5 xl:col-span-5" : "col-span-1"}
            >
              <InvoiceForm
                invoice={invoice}
                onChangeInvoice={(updated) => setInvoice(updated)}
                onPrint={handlePrint}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Right Column: The Exact Official A4 Preview */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div
              className={viewMode === "split" ? "lg:col-span-7 xl:col-span-7" : "col-span-1"}
            >
              <div className="sticky top-20">
                <OfficialInvoicePreview invoice={invoice} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
