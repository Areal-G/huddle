import { prisma } from "@huddle/database";

import { stripe } from "../lib/stripe";

(async function syncCancelAtPeriodEnd() {
  let processed = 0;
  let failed = 0;

  const userSubscriptions = await prisma.subscription.findMany({
    select: {
      id: true,
    },
  });

  console.info(`🚀 Syncing ${userSubscriptions.length} subscriptions...`);

  for (const userSubscription of userSubscriptions) {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        userSubscription.id,
      );

      await prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });

      console.info(`✅ Subscription ${subscription.id} synced`);
      processed++;
    } catch (error) {
      console.error(
        `❌ Failed to sync subscription ${userSubscription.id}:`,
        error,
      );
      failed++;
    }
  }

  console.info(`📊 Sync complete: ${processed} processed, ${failed} failed`);
})();
