/**
 * Centralized round-robin distribution system.
 * Calls the backend API to distribute leads.
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
    await api.distribute(data);
  } catch {
    // Don't block signup if distribution fails
  }
}
