/**
 * Centralized round-robin distribution system.
 * Calls a backend function that atomically assigns leads
 * to agent Google Sheets using a database counter.
 */

import { supabase } from "@/integrations/supabase/client";

export interface RegistrationData {
  name: string;
  phone: string;
  role: "affiliate" | "product_owner";
  plan: string;
  date: string;
}

export async function distributeToSheet(data: RegistrationData): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("distribute-lead", {
      body: data,
    });

    if (error) {
      // Silent fail - don't block signup
    }
  } catch {
    // Don't block signup if distribution fails
    // Don't block signup if distribution fails
  }
}
