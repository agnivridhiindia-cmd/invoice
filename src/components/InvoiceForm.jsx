import { FileText, Package, Printer, RotateCcw, Plus, Trash2, CreditCard, Eye, EyeOff, Zap } from "lucide-react";
import { INVOICE_TYPES } from "../utils/constants.js";
import { getPlaceOfSupplyWithCode } from "../utils/gstUtils.js";

function formatDisplayAmount(val) {
  const num = Number(val) || 0;
  if (num % 1 === 0) {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);
  }
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export default function InvoiceForm({ invoice, onChangeInvoice, onPrint, onReset }) {
  // Ensure services array exists
  const services = invoice.services && invoice.services.length > 0
    ? invoice.services
    : [
        {
          id: "srv_1",
          description: invoice.description || "Consultancy Services",
          hsnSac: invoice.hsnSac || "998311",
          quantity: Number(invoice.quantity) || 1,
          rate: Number(invoice.rate) || 10000,
          gstPercent: Number(invoice.gstPercent) || 18,
          showOnInvoice: true,
          includeInTotal: true,
          chargePayment: true
        }
      ];

  // Calculate live totals:
  // ONLY services with showOnInvoice !== false AND includeInTotal !== false have their amount added to the total.
  let taxableAmount = 0;
  let totalGst = 0;

  services.forEach((srv) => {
    const isShown = srv.showOnInvoice !== false;
    const isCharged = isShown && srv.includeInTotal !== false && srv.chargePayment !== false;
    if (isCharged) {
      const qty = Number(srv.quantity) || 1;
      const rate = Number(srv.rate) || 0;
      const itemTaxable = qty * rate;
      const gstPercent = Number(srv.gstPercent !== undefined ? srv.gstPercent : 18);
      const itemGst = itemTaxable * (gstPercent / 100);

      taxableAmount += itemTaxable;
      totalGst += itemGst;
    }
  });

  const totalAmount = taxableAmount + totalGst;
  const placeOfSupply = invoice.placeOfSupply || "Telangana (36)";
  const isIgst = !placeOfSupply.toLowerCase().includes("uttar pradesh");

  const handleChange = (field, value) => {
    let updated = { ...invoice, [field]: value };

    // When invoice type changes
    if (field === "type") {
      const selectedType = INVOICE_TYPES.find((t) => t.name === value);
      if (selectedType) {
        const defaultGst = selectedType.defaultGstPercent;
        updated.gstPercent = defaultGst;
        // Update all services' GST percent to match the type
        updated.services = services.map((s) => ({
          ...s,
          gstPercent: defaultGst
        }));
      }
    }

    // Auto-derive place of supply from GSTIN or state
    if (field === "gstin" && value && value.trim().length >= 2) {
      updated.placeOfSupply = getPlaceOfSupplyWithCode(invoice.placeOfSupply, invoice.address, value);
    }
    if (field === "state" && value) {
      updated.placeOfSupply = getPlaceOfSupplyWithCode(value, invoice.address, invoice.gstin);
    }

    onChangeInvoice(updated);
  };

  // Service Row Actions (Vercel-style)
  const handleAddService = () => {
    const newId = `srv_${Date.now()}`;
    const newService = {
      id: newId,
      description: "",
      hsnSac: "998311",
      quantity: 1,
      rate: 10000,
      gstPercent: 18,
      showOnInvoice: true,
      includeInTotal: true,
      chargePayment: true
    };
    const updatedServices = [...services, newService];
    onChangeInvoice({
      ...invoice,
      services: updatedServices
    });
  };

  // The ONLY way to remove a scheme from the invoice is using the trash icon
  const handleRemoveService = (serviceId) => {
    if (services.length <= 1) return;
    const updatedServices = services.filter((s) => s.id !== serviceId);
    onChangeInvoice({
      ...invoice,
      services: updatedServices
    });
  };

  const handleServiceFieldChange = (serviceId, field, val) => {
    const updatedServices = services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, [field]: val };
      }
      return s;
    });
    onChangeInvoice({
      ...invoice,
      services: updatedServices
    });
  };

  // Control 1: Show on Invoice toggle
  const handleToggleShow = (serviceId, shouldShow) => {
    const updatedServices = services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, showOnInvoice: shouldShow };
      }
      return s;
    });
    onChangeInvoice({
      ...invoice,
      services: updatedServices
    });
  };

  // Control 2: Include in Total Payment toggle
  const handleToggleIncludeInTotal = (serviceId, shouldInclude) => {
    const updatedServices = services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, includeInTotal: shouldInclude, chargePayment: shouldInclude };
      }
      return s;
    });
    onChangeInvoice({
      ...invoice,
      services: updatedServices
    });
  };

  // Quick Preset Actions for Multi-Service Payments
  const handleChargeAll = () => {
    const updatedServices = services.map((s) => ({
      ...s,
      showOnInvoice: true,
      includeInTotal: true,
      chargePayment: true
    }));
    onChangeInvoice({ ...invoice, services: updatedServices });
  };

  const handleChargeSingleOnly = (targetId) => {
    const updatedServices = services.map((s) => ({
      ...s,
      showOnInvoice: true,
      includeInTotal: s.id === targetId,
      chargePayment: s.id === targetId
    }));
    onChangeInvoice({ ...invoice, services: updatedServices });
  };

  return (
    <div className="invoice-form-card no-print">
      {/* Blue Header Strip matching the screenshot */}
      <div className="invoice-form-header">
        <div className="invoice-form-header-title">
          <FileText size={18} />
          <h2>Invoice Details</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 font-medium"
            title="Reset all fields to blank"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Type Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={invoice.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="form-select w-full text-xs font-semibold py-2"
          >
            {INVOICE_TYPES.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Client Name & Contact Person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={invoice.clientName || ""}
              onChange={(e) => handleChange("clientName", e.target.value)}
              placeholder="Enter client/company name"
              className="form-input w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Contact Person</label>
            <input
              type="text"
              value={invoice.contactPerson || ""}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              placeholder="Contact person name"
              className="form-input w-full text-xs"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Address</label>
          <textarea
            rows={2}
            value={invoice.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Full address"
            className="form-textarea w-full text-xs"
          />
        </div>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">City</label>
            <input
              type="text"
              value={invoice.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
              className="form-input w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">State</label>
            <input
              type="text"
              value={invoice.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="State"
              className="form-input w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Pincode</label>
            <input
              type="text"
              value={invoice.pincode || ""}
              onChange={(e) => handleChange("pincode", e.target.value)}
              placeholder="Pincode"
              className="form-input w-full text-xs"
            />
          </div>
        </div>

        {/* GSTIN and Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">GSTIN</label>
            <input
              type="text"
              value={invoice.gstin || ""}
              onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
              placeholder="GSTIN (optional)"
              className="form-input w-full text-xs uppercase font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Mobile</label>
            <input
              type="text"
              value={invoice.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
              placeholder="Mobile/Phone"
              className="form-input w-full text-xs"
            />
          </div>
        </div>

        {/* Issue Date & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={invoice.issueDate || ""}
              onChange={(e) => handleChange("issueDate", e.target.value)}
              className="form-input w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Due Date</label>
            <input
              type="date"
              value={invoice.dueDate || ""}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="form-input w-full text-xs"
            />
          </div>
        </div>

        {/* Section: Services & Pricing (Vercel-style dynamic rows) */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
              <Package size={16} className="text-amber-700" />
              <span>Item & Pricing</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {services.filter((s) => s.showOnInvoice !== false).length} of {services.length} on Invoice
              </span>
            </div>

            {/* Quick Payment Allocation Shortcuts (When 2 or more schemes are added) */}
            {services.length > 1 && (
              <div className="scheme-quick-toolbar">
                <div className="scheme-toolbar-label">
                  <Zap size={14} className="text-amber-500" />
                  <span>Quick Setup:</span>
                </div>
                <div className="scheme-toolbar-btns">
                  <button
                    type="button"
                    onClick={handleChargeAll}
                    className={`toolbar-chip ${
                      services.every((s) => s.showOnInvoice !== false && s.includeInTotal !== false && s.chargePayment !== false)
                        ? "is-selected"
                        : ""
                    }`}
                    title="Charge all schemes together on this invoice"
                  >
                    Charge All ({services.length})
                  </button>
                  {services.map((s, i) => {
                    const isOnlyThisCharged =
                      s.showOnInvoice !== false &&
                      s.includeInTotal !== false &&
                      s.chargePayment !== false &&
                      services.filter((x) => x.showOnInvoice !== false && x.includeInTotal !== false && x.chargePayment !== false).length === 1;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleChargeSingleOnly(s.id)}
                        className={`toolbar-chip ${isOnlyThisCharged ? "is-selected" : ""}`}
                        title={`Include only Scheme #${i + 1} in the payable total`}
                      >
                        Scheme #{i + 1} Only
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Service Cards (Modern Vercel-style UI) */}
          <div className="space-y-3">
            {services.map((srv, idx) => {
              const isShown = srv.showOnInvoice !== false;
              const isCharged = isShown && srv.includeInTotal !== false && srv.chargePayment !== false;
              const qty = Number(srv.quantity) || 1;
              const rate = Number(srv.rate) || 0;
              const itemTaxable = qty * rate;
              const gstPercent = Number(srv.gstPercent !== undefined ? srv.gstPercent : 18);
              const itemGst = itemTaxable * (gstPercent / 100);
              const itemTotal = itemTaxable + itemGst;

              return (
                <div
                  key={srv.id}
                  className={`service-row-card ${!isShown ? "is-hidden-on-invoice" : isCharged ? "is-billed" : ""}`}
                >
                  {/* Card Header with Granular Salesperson Controls */}
                  <div className="scheme-card-header">
                    <div className="scheme-card-badge-wrap">
                      <span className="scheme-num-badge">Scheme #{idx + 1}</span>
                      {isCharged ? (
                        <span className="scheme-status-pill status-billed">
                          <span className="status-dot dot-purple"></span>
                          <span>Billed in Total (₹{formatDisplayAmount(itemTotal)})</span>
                        </span>
                      ) : isShown ? (
                        <span className="scheme-status-pill status-ref">
                          <span className="status-dot dot-gray"></span>
                          <span>On Invoice (₹0 in Total)</span>
                        </span>
                      ) : (
                        <span className="scheme-status-pill status-hidden">
                          <span>Hidden from Invoice</span>
                        </span>
                      )}
                    </div>

                    <div className="scheme-card-actions">
                      {/* Control 1: Show on Invoice */}
                      <button
                        type="button"
                        onClick={() => handleToggleShow(srv.id, !isShown)}
                        className={`scheme-toggle-btn ${isShown ? "is-active-print" : ""}`}
                        title={isShown ? "Currently printed on invoice (click to hide)" : "Currently hidden from invoice (click to print)"}
                      >
                        {isShown ? <Eye size={13} /> : <EyeOff size={13} />}
                        <span>{isShown ? "Print On" : "Print Off"}</span>
                      </button>

                      {/* Control 2: Include in Total Payment */}
                      <button
                        type="button"
                        disabled={!isShown}
                        onClick={() => handleToggleIncludeInTotal(srv.id, !isCharged)}
                        className={`scheme-toggle-btn ${isCharged ? "is-active-bill" : ""}`}
                        title={isCharged ? "Payment added to total (click to omit from total)" : "Payment excluded from total (click to add to total)"}
                      >
                        <CreditCard size={13} />
                        <span>{isCharged ? "In Total" : "Omit Total"}</span>
                      </button>

                      {/* Trash Button — THE ONLY WAY to remove a scheme */}
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveService(srv.id)}
                          className="scheme-trash-btn"
                          title="Delete this scheme completely"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scheme Description Input */}
                  <div className="mb-2.5">
                    <label className="block text-[10.5px] font-bold text-gray-700 mb-1">
                      Scheme / Service Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={srv.description || ""}
                      onChange={(e) => handleServiceFieldChange(srv.id, "description", e.target.value)}
                      placeholder="e.g. Consultancy Services / PMEGP Project Viability Report..."
                      className="form-textarea w-full text-xs font-medium"
                    />
                  </div>

                  {/* Grid of HSN/SAC, Quantity, Rate, and GST % */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">HSN/SAC</label>
                      <input
                        type="text"
                        value={srv.hsnSac || "998311"}
                        onChange={(e) => handleServiceFieldChange(srv.id, "hsnSac", e.target.value)}
                        className="form-input w-full text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">GST %</label>
                      <input
                        type="number"
                        value={srv.gstPercent !== undefined ? srv.gstPercent : 18}
                        onChange={(e) => handleServiceFieldChange(srv.id, "gstPercent", Number(e.target.value))}
                        className="form-input w-full text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={srv.quantity}
                        onChange={(e) => handleServiceFieldChange(srv.id, "quantity", e.target.value)}
                        className="form-input w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Rate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={srv.rate}
                        onChange={(e) => handleServiceFieldChange(srv.id, "rate", e.target.value)}
                        className="form-input w-full text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Live Calculation Mini-Strip for this Scheme */}
                  <div className="scheme-mini-calc">
                    <div>
                      Taxable: <strong>₹{formatDisplayAmount(itemTaxable)}</strong> + GST: <strong>₹{formatDisplayAmount(itemGst)}</strong>
                    </div>
                    <div>
                      Scheme Total: <strong className="text-purple-700">₹{formatDisplayAmount(itemTotal)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vercel-style "+ Add Another Scheme" Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleAddService}
              className="btn-add-service-modern"
            >
              <Plus size={15} />
              <span>Add Another Scheme</span>
            </button>
          </div>

          {/* Place of Supply and Notes */}
          <div className="space-y-3 mt-4 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Place of Supply <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={invoice.placeOfSupply || "Telangana (36)"}
                onChange={(e) => handleChange("placeOfSupply", e.target.value)}
                placeholder="e.g. Telangana (36) or Uttar Pradesh (09)"
                className="form-input w-full text-xs"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">
                Uttar Pradesh for intra-state (CGST+SGST), other for IGST
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Notes</label>
              <textarea
                rows={2}
                value={invoice.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Payment terms..."
                className="form-textarea w-full text-xs"
              />
            </div>

            {/* Authorised Stamp Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <span className="text-xs font-bold text-gray-800">Authorised Signatory Stamp</span>
                <p className="text-[10px] text-gray-500">Display official AgniVridhi seal on this Proforma Invoice</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!invoice.showStamp}
                  onChange={(e) => handleChange("showStamp", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Live Calculation Bottom Strip matching the AgniCRM screenshot */}
        <div className="invoice-calc-strip">
          <div className="calc-col">
            <div className="calc-label calc-label-taxable">Taxable Amount</div>
            <div className="calc-value calc-value-taxable">
              ₹{formatDisplayAmount(taxableAmount)}
            </div>
          </div>

          <div className="calc-col calc-col-divider">
            <div className="calc-label calc-label-gst">
              {totalGst > 0 ? (isIgst ? `IGST` : `CGST+SGST`) : "GST (0%)"}
            </div>
            <div className="calc-value calc-value-gst">
              ₹{formatDisplayAmount(totalGst)}
            </div>
          </div>

          <div className="calc-col calc-col-divider">
            <div className="calc-label calc-label-total">Total Payable</div>
            <div className="calc-value calc-value-total">
              ₹{formatDisplayAmount(totalAmount)}
            </div>
          </div>
        </div>

        {/* Print / Download Button */}
        <button
          type="button"
          onClick={onPrint}
          className="invoice-print-btn"
        >
          <Printer size={18} />
          <span>Print / Save as PDF</span>
        </button>
      </div>
    </div>
  );
}
