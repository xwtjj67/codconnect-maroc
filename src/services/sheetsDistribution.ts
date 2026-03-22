/**
 * Round-robin distribution system for sending registration data
 * to multiple Google Sheets (one per agent).
 * 
 * Replace the placeholder URLs below with your actual
 * Google Apps Script Web App URLs.
 */

const SHEET_URLS: string[] = [
  "https://script.google.com/macros/s/SHEET_1_URL/exec",
  "https://script.google.com/macros/s/SHEET_2_URL/exec",
  "https://script.google.com/macros/s/SHEET_3_URL/exec",
  "https://script.google.com/macros/s/SHEET_4_URL/exec",
  "https://script.google.com/macros/s/SHEET_5_URL/exec",
  "https://script.google.com/macros/s/SHEET_6_URL/exec",
  "https://script.google.com/macros/s/SHEET_7_URL/exec",
  "https://script.google.com/macros/s/SHEET_8_URL/exec",
  "https://script.google.com/macros/s/SHEET_9_URL/exec",
  "https://script.google.com/macros/s/SHEET_10_URL/exec",
  "https://script.google.com/macros/s/SHEET_11_URL/exec",
];

const COUNTER_KEY = "codconnect_sheet_counter";

function getNextSheetIndex(): number {
  const current = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
  const next = (current + 1) % SHEET_URLS.length;
  localStorage.setItem(COUNTER_KEY, String(next));
  return current;
}

export interface RegistrationData {
  name: string;
  phone: string;
  role: "affiliate" | "product_owner";
  plan: string;
  date: string;
}

export async function distributeToSheet(data: RegistrationData): Promise<void> {
  const index = getNextSheetIndex();
  const url = SHEET_URLS[index];

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log(`Registration sent to sheet ${index + 1}`);
  } catch (error) {
    console.error(`Failed to send to sheet ${index + 1}:`, error);
    // Don't block signup if sheet fails
  }
}
