import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * AiRA Chat Edge Function
 * 
 * This is a STUB function for the AI chat interface.
 * 
 * TODO: Implement your AWS API Gateway + Lambda integration here
 * 
 * Expected flow:
 * 1. Receive message from authenticated user
 * 2. Check user has credits available
 * 3. Deduct 1 credit from user's balance
 * 4. Call AWS API Gateway endpoint that triggers Lambda -> Claude
 * 5. Return Claude's response
 * 
 * Required secrets to add:
 * - AWS_API_GATEWAY_URL: Your AWS API Gateway endpoint URL
 * - AWS_API_KEY: Your AWS API Gateway API key (if using API key auth)
 * 
 * Example AWS call:
 * const response = await fetch(Deno.env.get("AWS_API_GATEWAY_URL"), {
 *   method: "POST",
 *   headers: {
 *     "Content-Type": "application/json",
 *     "x-api-key": Deno.env.get("AWS_API_KEY") || "",
 *   },
 *   body: JSON.stringify({ message, conversationHistory }),
 * });
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { message } = await req.json();
    
    if (!message) {
      throw new Error("Message is required");
    }

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check user's credits
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError) throw new Error(`Profile error: ${profileError.message}`);
    if (!profile || profile.credits <= 0) {
      throw new Error("Insufficient credits");
    }

    // Deduct 1 credit
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (updateError) throw new Error(`Credit update error: ${updateError.message}`);

    // Save user message
    await supabaseClient.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
    });

    // ============================================================
    // TODO: Replace this mock response with your AWS API Gateway call
    // ============================================================
    
    // Mock response for now
    const mockResponses = [
      "That's a great question about retirement planning! Based on your query, I'd recommend considering a diversified approach that balances growth potential with income stability. Would you like me to elaborate on specific strategies?",
      "When it comes to Social Security, timing is crucial. Delaying benefits until age 70 can increase your monthly payment by up to 32% compared to claiming at 62. However, the best decision depends on your individual circumstances, health, and financial needs.",
      "For tax-efficient withdrawals in retirement, consider the order: first, use taxable accounts to allow tax-deferred accounts more time to grow. Then, tap traditional IRAs/401(k)s, and finally Roth accounts for tax-free growth.",
      "Healthcare costs in retirement are often underestimated. The average 65-year-old couple may need approximately $300,000 saved for healthcare expenses in retirement. Have you considered a Health Savings Account (HSA) as part of your strategy?",
    ];
    
    const aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Save AI response
    await supabaseClient.from("chat_messages").insert({
      user_id: user.id,
      role: "assistant",
      content: aiResponse,
    });

    console.log(`Chat completed for user ${user.id}, remaining credits: ${profile.credits - 1}`);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      remainingCredits: profile.credits - 1,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("AiRA chat error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
