// Indian GST State Map (Codes 01 to 38)
export const GST_STATE_MAP = {
  "01": "Jammu and Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
  "28": "Andhra Pradesh",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman and Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh"
};

export const STATE_TO_CODE = {};
for (const [code, name] of Object.entries(GST_STATE_MAP)) {
  STATE_TO_CODE[name.toLowerCase()] = code;
}
STATE_TO_CODE["up"] = "09";
STATE_TO_CODE["mp"] = "23";
STATE_TO_CODE["tn"] = "33";
STATE_TO_CODE["wb"] = "19";
STATE_TO_CODE["mh"] = "27";
STATE_TO_CODE["uk"] = "05";
STATE_TO_CODE["ap"] = "37";
STATE_TO_CODE["ts"] = "36";
STATE_TO_CODE["odisha"] = "21";
STATE_TO_CODE["orissa"] = "21";
STATE_TO_CODE["pondicherry"] = "34";
STATE_TO_CODE["ncr"] = "07";
STATE_TO_CODE["new delhi"] = "07";

/**
 * Derives state and 2-digit code from GSTIN, State Name, or Address.
 */
export function getPlaceOfSupplyWithCode(placeOrState, address = "", gstin = "") {
  if (placeOrState && typeof placeOrState === "string" && /\(\d{2}\)/.test(placeOrState)) {
    return placeOrState.trim();
  }

  // 1. First 2 digits of GSTIN indicate state code
  if (gstin && typeof gstin === "string") {
    const cleanGst = gstin.trim();
    if (/^\d{2}/.test(cleanGst)) {
      const code = cleanGst.slice(0, 2);
      if (GST_STATE_MAP[code]) {
        return `${GST_STATE_MAP[code]} (${code})`;
      }
    }
  }

  // 2. Match direct state name
  if (placeOrState && typeof placeOrState === "string") {
    const cleanPlace = placeOrState.trim().toLowerCase();
    if (STATE_TO_CODE[cleanPlace]) {
      const code = STATE_TO_CODE[cleanPlace];
      return `${GST_STATE_MAP[code]} (${code})`;
    }
    for (const [sName, sCode] of Object.entries(STATE_TO_CODE)) {
      if (cleanPlace.includes(sName)) {
        return `${GST_STATE_MAP[sCode]} (${sCode})`;
      }
    }
  }

  // 3. Search in address
  if (address && typeof address === "string") {
    const cleanAddr = address.toLowerCase();
    for (const [sName, sCode] of Object.entries(STATE_TO_CODE)) {
      const regex = new RegExp(`\\b${sName}\\b`, "i");
      if (regex.test(cleanAddr)) {
        return `${GST_STATE_MAP[sCode]} (${sCode})`;
      }
    }
  }

  return placeOrState ? placeOrState.trim() : "Uttar Pradesh (09)";
}

/**
 * Extracts 2-digit state code from place of supply string, e.g. "Telangana (36)" -> "36".
 */
export function extractStateCode(str = "") {
  const match = str.match(/\((\d{2})\)/);
  if (match) return match[1];
  const gstinMatch = str.match(/^(\d{2})/);
  if (gstinMatch) return gstinMatch[1];
  return "";
}

/**
 * Checks if supply is intra-state (same state code -> CGST + SGST) or inter-state (IGST).
 */
export function isInterStateSupply(sellerState, placeOfSupply, sellerGstin = "", buyerGstin = "") {
  const sellerCode = extractStateCode(sellerState) || (sellerGstin.slice(0, 2));
  const buyerCode = extractStateCode(placeOfSupply) || (buyerGstin.slice(0, 2));

  if (sellerCode && buyerCode) {
    return sellerCode !== buyerCode;
  }

  // Fallback to name comparison
  const s1 = (sellerState || "").toLowerCase().replace(/[^a-z]/g, "");
  const s2 = (placeOfSupply || "").toLowerCase().replace(/[^a-z]/g, "");
  return s1 !== s2;
}
