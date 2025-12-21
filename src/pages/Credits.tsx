import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
}

const Credits = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const tiers: PricingTier[] = [
    {
      id: "starter",
      name: "Starter",
      credits: 25,
      price: 9.99,
      description: "Perfect for occasional questions",
      icon: Sparkles,
      features: [
        "25 AI conversations",
        "Basic retirement planning",
        "Social Security guidance",
        "Investment basics",
      ],
    },
    {
      id: "plus",
      name: "Plus",
      credits: 100,
      price: 29.99,
      description: "Great for active planners",
      icon: Zap,
      popular: true,
      features: [
        "100 AI conversations",
        "Advanced planning strategies",
        "Tax optimization tips",
        "Healthcare cost planning",
        "Priority response time",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      credits: 300,
      price: 79.99,
      description: "For comprehensive planning",
      icon: Crown,
      features: [
        "300 AI conversations",
        "All Plus features",
        "Estate planning guidance",
        "Withdrawal strategies",
        "Inflation protection",
        "Legacy planning",
      ],
    },
  ];

  const handlePurchase = async (tier: PricingTier) => {
    setSelectedTier(tier.id);
    setIsProcessing(true);

    // This would integrate with Stripe in production
    setTimeout(() => {
      toast({
        title: "Credits Added!",
        description: `${tier.credits} credits have been added to your account.`,
      });
      setIsProcessing(false);
      setSelectedTier(null);
    }, 2000);
  };

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
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative border-2 transition-all duration-300 hover:-translate-y-1 ${
                tier.popular
                  ? "border-gold shadow-glow"
                  : "border-border hover:border-gold/50"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-gold to-gold-dark text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${
                  tier.popular ? "bg-gradient-to-br from-gold to-gold-dark" : "bg-sage-light"
                }`}>
                  <tier.icon className={`h-8 w-8 ${tier.popular ? "text-primary-foreground" : "text-sage"}`} />
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
                  variant={tier.popular ? "hero" : "outline-gold"}
                  className="w-full"
                  onClick={() => handlePurchase(tier)}
                  disabled={isProcessing}
                >
                  {isProcessing && selectedTier === tier.id ? (
                    "Processing..."
                  ) : (
                    `Get ${tier.credits} Credits`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
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
