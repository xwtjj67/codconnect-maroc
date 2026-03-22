import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Google Apps Script Web App URLs — one per agent sheet
// IMPORTANT: Replace these with your actual deployed Apps Script URLs
const SHEET_URLS: string[] = [
  "https://script.google.com/macros/s/SHEET_1_DEPLOY_URL/exec", // data1.xlsx
  "https://script.google.com/macros/s/SHEET_2_DEPLOY_URL/exec", // data2.xlsx
  "https://script.google.com/macros/s/SHEET_3_DEPLOY_URL/exec", // data3.xlsx
  "https://script.google.com/macros/s/SHEET_4_DEPLOY_URL/exec", // data4.xlsx
  "https://script.google.com/macros/s/SHEET_5_DEPLOY_URL/exec", // data5.xlsx
  "https://script.google.com/macros/s/SHEET_6_DEPLOY_URL/exec", // data6.xlsx
  "https://script.google.com/macros/s/SHEET_7_DEPLOY_URL/exec", // data7.xlsx
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, role, plan, date } = await req.json();

    if (!name || !phone || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, phone, role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Atomic: get current index and increment in one transaction
    const { data: sheetIndex, error: rpcError } = await supabase.rpc(
      "get_next_sheet_index"
    );

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return new Response(
        JSON.stringify({ error: "Failed to get distribution index" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const selectedUrl = SHEET_URLS[sheetIndex];
    let success = true;
    let errorMessage: string | null = null;

    // Try to send to selected sheet
    try {
      await fetch(selectedUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, role, plan, date }),
      });
      console.log(`Lead sent to sheet ${sheetIndex + 1}`);
    } catch (err) {
      console.error(`Sheet ${sheetIndex + 1} failed:`, err);
      success = false;
      errorMessage = String(err);

      // Fallback: try next sheets
      for (let attempt = 1; attempt < SHEET_URLS.length; attempt++) {
        const fallbackIndex = (sheetIndex + attempt) % SHEET_URLS.length;
        try {
          await fetch(SHEET_URLS[fallbackIndex], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, role, plan, date }),
          });
          console.log(`Fallback: Lead sent to sheet ${fallbackIndex + 1}`);
          success = true;
          errorMessage = null;
          break;
        } catch (fallbackErr) {
          console.error(`Fallback sheet ${fallbackIndex + 1} also failed`);
        }
      }
    }

    // Log the distribution
    await supabase.from("distribution_logs").insert({
      user_name: name,
      user_phone: phone,
      user_role: role,
      sheet_index: sheetIndex,
      success,
      error_message: errorMessage,
    });

    return new Response(
      JSON.stringify({
        success,
        sheet_index: sheetIndex + 1,
        message: success
          ? `Lead distributed to sheet ${sheetIndex + 1}`
          : "All sheets failed",
      }),
      { status: success ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
