import React from "react";
import { AGNIVRIDHI_SELLER } from "../utils/constants.js";
import { formatAmount, formatIntAmount, numberToWordsINR } from "../utils/numberToWords.js";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatHeaderDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const validD = isNaN(d.getTime()) ? new Date() : d;
  return `${MONTHS_SHORT[validD.getMonth()]} ${String(validD.getDate()).padStart(2, "0")}, ${validD.getFullYear()}`;
}

function formatFooterDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const validD = isNaN(d.getTime()) ? new Date() : d;
  return `${String(validD.getDate()).padStart(2, "0")} ${MONTHS_SHORT[validD.getMonth()]} ${validD.getFullYear()}`;
}

export default function OfficialInvoicePreview({ invoice }) {
  const type = invoice.type || "Proforma Invoice";

  // Multi-service extraction
  // ALL services remain visible on the invoice.
  // The scheme is ONLY removed from the invoice when the user deletes it via the trash button.
  const services = invoice.services && invoice.services.length > 0
    ? invoice.services
    : [
        {
          id: "srv_1",
          description: invoice.description || "Consultancy Services",
          hsnSac: invoice.hsnSac || "998311",
          quantity: Number(invoice.quantity) || 1,
          rate: Number(invoice.rate) || 0,
          gstPercent: Number(invoice.gstPercent) || 18,
          showOnInvoice: true,
          includeInTotal: true
        }
      ];

  // Salesperson controls which schemes appear on invoice:
  const displayServices = services.filter((s) => s.showOnInvoice !== false);

  // Proforma Invoice includes standard GST billing
  const hasGst = true;

  // Sum up totals across displayed services:
  // ONLY services with includeInTotal !== false have their amount added to the invoice total.
  let taxableAmount = 0;
  let totalGst = 0;
  let totalQuantity = 0;

  displayServices.forEach((srv) => {
    const isCharged = srv.includeInTotal !== false && srv.chargePayment !== false;
    if (isCharged) {
      const qty = Number(srv.quantity) || 1;
      const rate = Number(srv.rate) || 0;
      const itemTaxable = qty * rate;
      const gstPercent = Number(srv.gstPercent !== undefined ? srv.gstPercent : 18);
      const itemGst = itemTaxable * (gstPercent / 100);

      totalQuantity += qty;
      taxableAmount += itemTaxable;
      totalGst += itemGst;
    }
  });

  const totalAmount = taxableAmount + totalGst;

  const invoiceNo = invoice.invoiceNo || "PI-20261014-001";
  const headerDateStr = formatHeaderDate(invoice.issueDate);
  const footerDateStr = formatFooterDate(invoice.issueDate);

  const clientName = invoice.clientName || "Client Name";
  const clientPhone = invoice.mobile || invoice.phone || "";
  const clientEmail = invoice.email || "";
  const clientGstin = invoice.gstin || "";
  let clientPan = invoice.pan || "";
  if (!clientPan && clientGstin.length >= 12) {
    clientPan = clientGstin.substring(2, 12).toUpperCase();
  }

  // Format client address with city, state, pincode
  const addrParts = [];
  if (invoice.address) addrParts.push(invoice.address);
  const locParts = [];
  if (invoice.city) locParts.push(invoice.city);
  if (invoice.state) locParts.push(invoice.state);
  if (locParts.length > 0) {
    addrParts.push(locParts.join(", ") + (invoice.pincode ? ` - ${invoice.pincode}` : ""));
  }

  const placeOfSupply = invoice.placeOfSupply || "Telangana (36)";
  const isIgst = !placeOfSupply.toLowerCase().includes("uttar pradesh");

  const totalInWords = numberToWordsINR(totalAmount);
  const taxInWords = numberToWordsINR(totalGst);

  return (
    <div className="official-preview-container">
      <div id="invoice-official-sheet" className="official-invoice-sheet">
        {/* Header Top: Title, Meta, and Logo */}
        <div className="off-header-top">
          <div>
            <h1 className="off-header-title">{type}</h1>
            <div className="off-header-meta">
              <div className="off-header-meta-row">
                <span className="off-header-meta-label">Invoice No #</span>
                <span className="off-header-meta-val">{invoiceNo}</span>
              </div>
              <div className="off-header-meta-row">
                <span className="off-header-meta-label">Invoice Date</span>
                <span className="off-header-meta-val">{headerDateStr}</span>
              </div>
            </div>
          </div>
          <div className="off-header-logo">
            <img src={AGNIVRIDHI_SELLER.logo} alt="AgniVridhi India Logo" />
          </div>
        </div>

        {/* Billed By & Billed To Cards */}
        <div className="off-cards-row">
          {/* Billed By */}
          <div className="off-address-card">
            <div className="off-card-kicker">Billed By</div>
            <div className="off-card-name">{AGNIVRIDHI_SELLER.companyName}</div>
            <div className="off-card-address">
              {AGNIVRIDHI_SELLER.address}<br />
              {AGNIVRIDHI_SELLER.city}<br />
              {AGNIVRIDHI_SELLER.state}
            </div>
            <div className="off-card-meta-list">
              <div><strong>GSTIN:</strong> {AGNIVRIDHI_SELLER.gstin}</div>
              <div><strong>PAN:</strong> {AGNIVRIDHI_SELLER.pan}</div>
              <div><strong>Email:</strong> {AGNIVRIDHI_SELLER.email}</div>
              <div><strong>Phone:</strong> {AGNIVRIDHI_SELLER.phone}</div>
            </div>
          </div>

          {/* Billed To */}
          <div className="off-address-card">
            <div className="off-card-kicker">Billed To</div>
            <div className="off-card-name">{clientName}</div>
            <div className="off-card-address">
              {addrParts.length > 0 ? (
                addrParts.map((p, i) => <div key={i}>{p}</div>)
              ) : (
                <div>Address not specified</div>
              )}
            </div>
            <div className="off-card-meta-list">
              {clientGstin && <div><strong>GSTIN:</strong> {clientGstin}</div>}
              {clientPan && <div><strong>PAN:</strong> {clientPan}</div>}
              {clientEmail && <div><strong>Email:</strong> {clientEmail}</div>}
              {clientPhone && <div><strong>Phone:</strong> {clientPhone}</div>}
            </div>
          </div>
        </div>

        {/* Country & Place of Supply */}
        <div className="off-supply-row">
          <span>Country of Supply: India</span>
          <span>Place of Supply: {placeOfSupply}</span>
        </div>

        {/* Items Table: Multi-Service Rows */}
        <table className="off-items-table">
          <thead>
            <tr>
              <th style={{ width: "34%" }}>Item</th>
              <th style={{ width: "10%" }} className="text-center">GST Rate</th>
              <th style={{ width: "8%" }} className="text-center">Quantity</th>
              <th style={{ width: "12%" }} className="text-right">Rate</th>
              <th style={{ width: "12%" }} className="text-right">Amount</th>
              <th style={{ width: "11%" }} className="text-right">
                {isIgst ? "IGST" : "CGST/SGST"}
              </th>
              <th style={{ width: "13%" }} className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {displayServices.map((srv, idx) => {
              const isCharged = srv.includeInTotal !== false && srv.chargePayment !== false;
              const qty = Number(srv.quantity) || 1;
              const rate = Number(srv.rate) || 0;
              const itemTaxable = qty * rate;
              const gstPercent = hasGst ? Number(srv.gstPercent !== undefined ? srv.gstPercent : 18) : 0;
              const itemGst = itemTaxable * (gstPercent / 100);
              const itemTotal = itemTaxable + itemGst;

              return (
                <tr
                  key={srv.id || idx}
                  className={`off-item-row ${isCharged ? "is-current-payment" : ""}`}
                >
                  <td>
                    {idx + 1}. &nbsp; {srv.description || "Consultancy Services"} (HSN/SAC: {srv.hsnSac || "998311"})
                  </td>
                  <td className="text-center">{gstPercent}%</td>
                  <td className="text-center">{qty}</td>
                  <td className="text-right">₹{formatIntAmount(rate)}</td>
                  <td className="text-right">₹{formatAmount(itemTaxable)}</td>
                  <td className="text-right">₹{formatAmount(itemGst)}</td>
                  <td className="text-right" style={{ fontWeight: isCharged ? 700 : 500 }}>
                    ₹{formatAmount(itemTotal)}
                  </td>
                </tr>
              );
            })}

            {/* Total Summary Row */}
            <tr className="off-total-row">
              <td>Total</td>
              <td></td>
              <td className="text-center">{totalQuantity}</td>
              <td></td>
              <td className="text-right">₹{formatAmount(taxableAmount)}</td>
              <td></td>
              <td className="text-right">₹{formatAmount(totalAmount)}</td>
            </tr>
          </tbody>
        </table>

        {/* Words and Totals Summary */}
        <div className="off-summary-split">
          <div className="off-words-col">
            TOTAL (IN WORDS) : {totalInWords}
          </div>
          <div className="off-totals-col">
            <table className="off-totals-inner-table">
              <tbody>
                <tr>
                  <td style={{ color: "#374151" }}>Amount</td>
                  <td className="text-right" style={{ fontWeight: 600 }}>
                    ₹{formatAmount(taxableAmount)}
                  </td>
                </tr>
                {hasGst && (
                  isIgst ? (
                    <tr>
                      <td style={{ color: "#374151" }}>IGST</td>
                      <td className="text-right" style={{ fontWeight: 600 }}>
                        ₹{formatAmount(totalGst)}
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        <td style={{ color: "#374151" }}>CGST</td>
                        <td className="text-right" style={{ fontWeight: 600 }}>
                          ₹{formatAmount(totalGst / 2)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: "#374151" }}>SGST</td>
                        <td className="text-right" style={{ fontWeight: 600 }}>
                          ₹{formatAmount(totalGst / 2)}
                        </td>
                      </tr>
                    </>
                  )
                )}
                <tr className="off-grand-total-row">
                  <td>Total (INR)</td>
                  <td className="text-right">₹{formatAmount(totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stamp & Authorised Signatory */}
        <div className="off-stamp-sign-wrap">
          <div className="off-stamp-sign-box">
            {invoice.showStamp ? (
              <img
                src={AGNIVRIDHI_SELLER.stamp}
                alt="AgniVridhi Authorised Signatory Stamp"
              />
            ) : (
              <div style={{ height: "60px" }}></div>
            )}
            <div className="off-stamp-sign-label">Authorised Signatory</div>
          </div>
        </div>

        {/* Tax Breakdown Table */}
        {hasGst && (
          <>
            <table className="off-tax-breakdown-table">
              <thead>
                <tr>
                  <th rowSpan={2} style={{ width: "28%", textAlign: "left" }}>
                    Tax Rate / Item
                  </th>
                  <th colSpan={2} style={{ width: "44%", textAlign: "center" }}>
                    {isIgst ? "IGST" : "GST"}
                  </th>
                  <th rowSpan={2} style={{ width: "28%", textAlign: "right" }}>
                    Total
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "20%", textAlign: "center" }}>Rate</th>
                  <th style={{ width: "24%", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayServices.map((srv, idx) => {
                  const isCharged = srv.includeInTotal !== false && srv.chargePayment !== false;
                  if (!isCharged) return null;
                  const qty = Number(srv.quantity) || 1;
                  const rate = Number(srv.rate) || 0;
                  const itemTaxable = qty * rate;
                  const gstPercent = Number(srv.gstPercent !== undefined ? srv.gstPercent : 18);
                  const itemGst = itemTaxable * (gstPercent / 100);

                  return (
                    <tr key={srv.id || idx}>
                      <td>{gstPercent}% ({srv.hsnSac || "998311"})</td>
                      <td className="text-center">{gstPercent}%</td>
                      <td className="text-right">₹{formatIntAmount(itemGst)}</td>
                      <td className="text-right">₹{formatIntAmount(itemGst)}</td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: 700 }}>
                  <td>Total</td>
                  <td></td>
                  <td className="text-right">₹{formatIntAmount(totalGst)}</td>
                  <td className="text-right">₹{formatIntAmount(totalGst)}</td>
                </tr>
              </tbody>
            </table>

            {/* Total Tax In Words */}
            <div className="off-tax-words-box">
              TOTAL TAX IN WORDS: {taxInWords}
            </div>
          </>
        )}

        {/* Running Footer */}
        <div className="off-running-footer">
          <div>
            <div className="off-footer-col-title">Invoice No</div>
            <div className="off-footer-col-val">{invoiceNo}</div>
          </div>
          <div>
            <div className="off-footer-col-title">Invoice Date</div>
            <div className="off-footer-col-val">{footerDateStr}</div>
          </div>
          <div style={{ maxWidth: "45%" }}>
            <div className="off-footer-col-title">Billed To</div>
            <div
              className="off-footer-col-val"
              style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {clientName}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="off-footer-col-title">&nbsp;</div>
            <div className="off-footer-col-val">Page 1 of 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
