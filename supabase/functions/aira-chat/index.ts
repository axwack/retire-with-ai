import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * AiRA Chat Edge Function
 * 
 * Calls AWS API Gateway + Lambda which invokes Claude for AI responses.
 * 
 * Flow:
 * 1. Receive message from authenticated user
 * 2. Check user has credits available
 * 3. Deduct 1 credit from user's balance
 * 4. Call AWS API Gateway endpoint that triggers Lambda -> Claude
 * 5. Return Claude's response
 */

const AIRA_SYSTEM_PROMPT = `You are AiRA (AI Retirement Advisor), a knowledgeable and empathetic AI assistant specializing in retirement planning. Your role is to help users navigate their retirement journey with confidence and clarity.

Key areas of expertise:
- Social Security optimization and claiming strategies
- Investment and portfolio management for retirees
- Tax-efficient withdrawal strategies
- Healthcare and Medicare planning
- Estate planning fundamentals
- Inflation protection strategies
- Legacy and wealth transfer planning

Guidelines:
- Always be warm, patient, and encouraging
- Explain complex financial concepts in simple terms
- Acknowledge when questions require professional advice
- Never provide specific investment recommendations or tax advice
- Encourage users to consult with licensed professionals for personalized advice
- Focus on education and general guidance

Remember: You are a trusted companion on their retirement journey, not a replacement for professional financial advisors.`;

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AIRA-CHAT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { message, conversationHistory = [] } = await req.json();
    logStep("Request received", { messageLength: message?.length });
    
    if (!message) {
      throw new Error("Message is required");
    }

    // Validate AWS secrets are configured
    const awsApiUrl = Deno.env.get("AWS_API_GATEWAY_URL");
    const awsApiKey = Deno.env.get("AWS_API_KEY");
    
    if (!awsApiUrl) {
      throw new Error("AWS_API_GATEWAY_URL is not configured");
    }
    logStep("AWS configuration verified");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

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
    logStep("Credits verified", { credits: profile.credits });

    // Deduct 1 credit
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (updateError) throw new Error(`Credit update error: ${updateError.message}`);
    logStep("Credit deducted");

    // Save user message
    await supabaseClient.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
    });
    logStep("User message saved");

    // Call AWS API Gateway -> Lambda -> Claude
    logStep("Calling AWS API Gateway", { url: awsApiUrl });
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Add API key if configured
    if (awsApiKey) {
      headers["x-api-key"] = awsApiKey;
    }

    const awsResponse = await fetch(awsApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        conversationHistory,
        systemPrompt: AIRA_SYSTEM_PROMPT,
      }),
    });

    if (!awsResponse.ok) {
      const errorText = await awsResponse.text();
      logStep("AWS API error", { status: awsResponse.status, error: errorText });
      throw new Error(`AWS API error: ${awsResponse.status} - ${errorText}`);
    }

    const awsData = await awsResponse.json();
    const aiResponse = awsData.response || awsData.message || awsData.content;
    
    if (!aiResponse) {
      logStep("Invalid AWS response format", { awsData });
      throw new Error("Invalid response format from AWS API");
    }
    logStep("AWS response received", { responseLength: aiResponse.length });

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
