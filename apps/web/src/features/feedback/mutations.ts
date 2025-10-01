import "server-only";

import { sendRawEmail } from "@huddle/emails";
import { env } from "@/env";

export async function submitFeedback({
  userName,
  userEmail,
  content,
}: {
  userName: string;
  userEmail: string;
  content: string;
}) {
  await sendRawEmail({
    // Feedback goes to this instance's own support address.
    to: env.SUPPORT_EMAIL,
    replyTo: userEmail,
    subject: "Feedback",
    text: `User: ${userName} (${userEmail})\n\n${content}`,
  });
}
