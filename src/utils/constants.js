import { AGNIVRIDHI_LOGO_BASE64, AGNIVRIDHI_STAMP_BASE64 } from "./assets.js";

// Official Proforma Invoice definition
export const INVOICE_TYPES = [
  {
    id: "PROFORMA",
    name: "Proforma Invoice",
    shortName: "Proforma",
    title: "Proforma Invoice",
    prefix: "PI",
    description: "Proforma Invoice: Official estimate with GST billing.",
    defaultGstPercent: 18,
    hasStamp: false,
    hasGst: true
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
