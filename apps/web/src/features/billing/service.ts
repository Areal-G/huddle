import "server-only";

import type { Stripe } from "@huddle/billing";
import { createStripeClient } from "@huddle/billing";

import { isBillingEnabled } from "@/features/billing/constants";

let stripeClient: Stripe | undefined;

export function getStripe() {
  if (!isBillingEnabled) {
    throw new Error("Stripe is unavailable because billing is disabled");
  }

  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY must be set when billing is enabled");
    }

    stripeClient = createStripeClient({ secretKey });
  }

  return stripeClient;
}
