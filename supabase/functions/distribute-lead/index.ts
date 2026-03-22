import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Google Apps Script Web App URLs — one per agent sheet
// IMPORTANT: Replace these with your actual deployed Apps Script URLs
const SHEET_URLS: string[] = [
  "https://script.google.com/macros/s/AKfycbzjqW1-8Rn0kihkizekjQnht8tjZhZlzXzo94IlYv_tj1ZhENZmJV7Zg55ikc8bnX1BHQ/exec",
  "https://script.google.com/macros/s/AKfycbwccmkMCJLQz-8xlIoGp8Tzc0J973xE5DWRhC-Yg74kCEkVMml-bddWmyHv8ULuDPzU/exec",
  "https://script.google.com/macros/s/AKfycbzVQPr_LsvBzfnMZrn3do4NgCQsyh0kVf-HUeJkXcEX5oWWT2IxddifpwnXNFFADDzzwg/exec",
  "https://script.google.com/macros/s/AKfycbyxQTXmKr47_F8wXIfmH1lzS1k_Y6NFkIASUA0s7JCvhbki_hyp6qsyrsNzp-30EkLE/exec",
  "https://script.google.com/macros/s/AKfycbyV04pu35s7ot3nsa-tVog2ds3Q6WeltTDdJA3-OjUDT7eOGMnv5V2mWdHaxK7nbHL8Hg/exec",
  "https://script.google.com/macros/s/AKfycbx-40TpSpmGWfdobcsntAx0uUOYz___Z-N1rx2TG9AC3LxGfa2Yne3TuS2KyqaO7Le0/exec",
  "https://script.google.com/macros/s/AKfycbzzMKI3oRziQbyZRKB1JyOpM8qo1mYYTpJB2F6PPq7KSWs6vGTjiKyPPqAYMCRhXOGcrw/exec",
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
