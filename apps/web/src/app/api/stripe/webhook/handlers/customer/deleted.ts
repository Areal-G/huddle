import type { Stripe } from "@huddle/billing";
import { prisma } from "@huddle/database";

export async function onCustomerDeleted(event: Stripe.Event) {
  const customer = event.data.object as Stripe.Customer;

  // Find and update the user with this customerId
  await prisma.user.updateMany({
    where: {
      customerId: customer.id,
    },
    data: {
      customerId: null,
    },
  });
}
