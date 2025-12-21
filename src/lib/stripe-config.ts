/**
 * Stripe Integration Configuration
 * 
 * These are the actual Stripe price IDs created for this project.
 * Use these when calling the create-checkout edge function.
 */

export const STRIPE_TIERS = {
  starter: {
    id: "starter",
    name: "Starter",
    credits: 25,
    price: 9.99,
    priceId: "price_1Sgp5PFotvmN2ZAQhnKZdOWq",
    productId: "prod_Te7KFILWi9VROq",
    description: "Perfect for occasional questions",
    features: [
      "25 AI conversations",
      "Basic retirement planning",
      "Social Security guidance",
      "Investment basics",
    ],
  },
  plus: {
    id: "plus",
    name: "Plus",
    credits: 100,
    price: 29.99,
    priceId: "price_1Sgp5bFotvmN2ZAQP06QN2SB",
    productId: "prod_Te7Kqku0hoCaGj",
    description: "Great for active planners",
    popular: true,
    features: [
      "100 AI conversations",
      "Advanced planning strategies",
      "Tax optimization tips",
      "Healthcare cost planning",
      "Priority response time",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    credits: 300,
    price: 79.99,
    priceId: "price_1Sgp68FotvmN2ZAQGBVyOgvB",
    productId: "prod_Te7Kky01Sna1uC",
    description: "For comprehensive planning",
    features: [
      "300 AI conversations",
      "All Plus features",
      "Estate planning guidance",
      "Withdrawal strategies",
      "Inflation protection",
      "Legacy planning",
    ],
  },
} as const;

export type StripeTierId = keyof typeof STRIPE_TIERS;
