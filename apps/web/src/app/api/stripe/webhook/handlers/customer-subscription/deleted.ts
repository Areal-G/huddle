import type { Stripe } from "@huddle/billing";
import { stripe } from "@huddle/billing";
import { prisma } from "@huddle/database";
import { posthog } from "@huddle/posthog/server";
import { z } from "zod";

const subscriptionMetadataSchema = z.object({
  userId: z.string(),
});

export async function onCustomerSubscriptionDeleted(event: Stripe.Event) {
  const subscription = await stripe.subscriptions.retrieve(
    (event.data.object as Stripe.Subscription).id,
  );

  // void any unpaid invoices
  const invoices = await stripe.invoices.list({
    subscription: subscription.id,
    status: "open",
  });

  for (const invoice of invoices.data) {
    await stripe.invoices.voidInvoice(invoice.id);
  }

  // delete the subscription from the database
  await prisma.subscription.delete({
    where: {
      id: subscription.id,
    },
  });

  const { userId } = subscriptionMetadataSchema.parse(subscription.metadata);

  posthog?.capture({
    distinctId: userId,
    event: "subscription cancel",
    properties: {
      $set: {
        tier: "hobby",
      },
    },
  });
}
