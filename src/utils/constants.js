import { AGNIVRIDHI_LOGO_BASE64, AGNIVRIDHI_STAMP_BASE64 } from "./assets.js";

// Only the 3 official invoice types requested
export const INVOICE_TYPES = [
  {
    id: "PROFORMA",
    name: "Proforma Invoice",
    shortName: "Proforma",
    title: "Proforma Invoice",
    prefix: "PI",
    description: "Proforma: Estimate (no paid stamp).",
    defaultGstPercent: 18,
    hasStamp: false,
    hasGst: true
  },
  {
    id: "TAX_INVOICE",
    name: "Tax Invoice",
    shortName: "Tax Invoice",
    title: "Tax Invoice",
    prefix: "INV",
    description: "Tax Invoice: Online with 18% GST.",
    defaultGstPercent: 18,
    hasStamp: true,
    hasGst: true
  },
  {
    id: "GST_INVOICE",
    name: "GST Invoice",
    shortName: "GST Invoice",
    title: "GST Invoice",
    prefix: "INV",
    description: "GST Invoice: Cash payment without GST.",
    defaultGstPercent: 0,
    hasStamp: true,
    hasGst: false
  }
];

// Official static seller details for AgniVridhi India
export const AGNIVRIDHI_SELLER = {
  companyName: "AgniVridhi India",
  address: "UrbTech Trade Centre, Sector 132,",
  city: "Noida,",
  state: "Uttar Pradesh, India - 201304",
  gstin: "09ABCCA3869R1ZU",
  pan: "ABCCA3869R",
  email: "agnivridhiindia@gmail.com",
  phone: "+91 92895 55190",
  logo: AGNIVRIDHI_LOGO_BASE64,
  stamp: AGNIVRIDHI_STAMP_BASE64
};
