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
      console.error("Distribution error:", error);
    } else {
      console.log("Lead distributed successfully");
    }
  } catch (err) {
    console.error("Failed to distribute lead:", err);
    // Don't block signup if distribution fails
  }
}
