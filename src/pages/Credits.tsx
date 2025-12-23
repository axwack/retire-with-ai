import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown, CreditCard, Loader2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS, StripeTierId } from "@/lib/stripe-config";

const Credits = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle success/cancel from Stripe redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const credits = searchParams.get("credits");

    if (success === "true") {
      toast({
        title: "Payment Successful!",
        description: `${credits} credits have been added to your account.`,
      });
      refreshProfile();
      // Clear URL params
      navigate("/credits", { replace: true });
    } else if (canceled === "true") {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. No credits were added.",
        variant: "destructive",
      });
      navigate("/credits", { replace: true });
    }
  }, [searchParams, toast, refreshProfile, navigate]);

  // Poll for credit updates when user comes back to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        refreshProfile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, refreshProfile]);

  const iconMap = {
    starter: Sparkles,
    plus: Zap,
    premium: Crown,
  };

  const handlePurchase = async (tierId: StripeTierId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase credits.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setSelectedTier(tierId);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: tierId },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  const tiers = Object.values(STRIPE_TIERS);

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
            <CreditCard className="h-4 w-4" />
            <span>AI Credits</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Power Your Retirement Planning
          </h1>
          <p className="text-lg text-muted-foreground">
            Purchase credits to chat with AiRA. Credits never expire, so use them at your own pace.
          </p>
          
          {user && profile && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light">
              <CreditCard className="h-5 w-5 text-sage" />
              <span className="text-lg font-semibold text-sage-dark">
                Current Balance: {profile.credits} Credits
              </span>
            </div>
          )}
        </div>

        {/* Sign in prompt */}
        {!user && (
          <div className="text-center mb-12 p-6 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground mb-4">Sign in to purchase credits and start planning your retirement with AiRA.</p>
            <Link to="/auth">
              <Button variant="hero" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In to Purchase
              </Button>
            </Link>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const Icon = iconMap[tier.id as keyof typeof iconMap];
            const isPopular = "popular" in tier && tier.popular;
            
            return (
              <Card
                key={tier.id}
                className={`relative border-2 transition-all duration-300 hover:-translate-y-1 ${
                  isPopular
                    ? "border-gold shadow-glow"
                    : "border-border hover:border-gold/50"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-gold to-gold-dark text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isPopular ? "bg-gradient-to-br from-gold to-gold-dark" : "bg-sage-light"
                  }`}>
                    <Icon className={`h-8 w-8 ${isPopular ? "text-primary-foreground" : "text-sage"}`} />
                  </div>
                  <CardTitle className="font-display text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {tier.credits} credits
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${(tier.price / tier.credits).toFixed(2)} per credit
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-sage flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isPopular ? "hero" : "outline-gold"}
                    className="w-full"
                    onClick={() => handlePurchase(tier.id as StripeTierId)}
                    disabled={isProcessing || !user}
                  >
                    {isProcessing && selectedTier === tier.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      `Get ${tier.credits} Credits`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground text-sm">
                No! Your credits never expire. Use them whenever you need retirement planning guidance.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">What counts as one credit?</h3>
              <p className="text-muted-foreground text-sm">
                Each message you send to AiRA uses one credit. AiRA's responses are free.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Can I get a refund?</h3>
              <p className="text-muted-foreground text-sm">
                If you're not satisfied, contact us within 7 days for a full refund on unused credits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Credits;
