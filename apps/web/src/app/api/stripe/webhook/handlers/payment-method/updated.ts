import type { Stripe } from "@huddle/billing";
import type { Prisma } from "@huddle/database";
import { prisma } from "@huddle/database";

export async function onPaymentMethodUpdated(event: Stripe.Event) {
  const paymentMethod = event.data.object as Stripe.PaymentMethod;

  if (!paymentMethod.customer) {
    return;
  }

  // Update the payment method data in our database
  await prisma.paymentMethod.update({
    where: {
      id: paymentMethod.id,
    },
    data: {
      type: paymentMethod.type,
      data: paymentMethod[paymentMethod.type] as Prisma.JsonObject,
    },
  });
}
