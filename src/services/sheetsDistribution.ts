/**
 * Centralized round-robin distribution system.
 * Calls the backend API to distribute leads to Google Sheets.
 */

import api from "@/services/api";

export interface RegistrationData {
  name: string;
  phone: string;
  role: "affiliate" | "product_owner";
  plan: string;
  date: string;
}

export async function distributeToSheet(data: RegistrationData): Promise<void> {
  try {
    const result = await api.distribute(data);
    console.log("📤 Distribution result:", result);
  } catch (err) {
    console.error("❌ Distribution failed (non-blocking):", err);
    // Don't block signup if distribution fails
  }
}
