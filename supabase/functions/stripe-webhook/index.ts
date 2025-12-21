import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * Stripe Webhook Handler - STUB
 * 
 * TODO: Configure this webhook in your Stripe Dashboard
 * 
 * Steps to complete:
 * 1. Go to Stripe Dashboard -> Developers -> Webhooks
 * 2. Add endpoint: https://yvsqbxatiqnfzhugoffw.supabase.co/functions/v1/stripe-webhook
 * 3. Select events: checkout.session.completed
 * 4. Copy the webhook signing secret
 * 5. Add STRIPE_WEBHOOK_SECRET to your secrets
 * 
 * This webhook handles:
 * - checkout.session.completed: Add credits to user's account
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    // TODO: Uncomment this when you add STRIPE_WEBHOOK_SECRET
    // const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    // if (!webhookSecret) throw new Error("Webhook secret not configured");
    // 
    // const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);

    // For now, parse directly (REMOVE THIS when webhook secret is configured)
    const event = JSON.parse(body);

    console.log("Received Stripe webhook event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { user_id, credits } = session.metadata || {};

      if (user_id && credits) {
        // Get current credits
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("credits")
          .eq("id", user_id)
          .single();

        const currentCredits = profile?.credits || 0;
        const newCredits = currentCredits + parseInt(credits);

        // Update credits
        const { error: updateError } = await supabaseClient
          .from("profiles")
          .update({ credits: newCredits })
          .eq("id", user_id);

        if (updateError) {
          console.error("Failed to update credits:", updateError);
          throw updateError;
        }

        // Record transaction
        await supabaseClient.from("credit_transactions").insert({
          user_id,
          amount: session.amount_total,
          credits: parseInt(credits),
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          status: "completed",
        });

        console.log(`Added ${credits} credits to user ${user_id}. New balance: ${newCredits}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Webhook error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
