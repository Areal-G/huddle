import "server-only";

import { sendRawEmail } from "@huddle/emails";
import { posthog } from "@/lib/posthog";

export async function submitFeedback({
  userId,
  userName,
  userEmail,
  content,
}: {
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
}) {
  await sendRawEmail({
    to: "feedback@huddle.dev",
    replyTo: userEmail,
    subject: "Feedback",
    text: `User: ${userName} (${userEmail})\n\n${content}`,
  });

  posthog()?.capture({
    event: "feedback_send",
    distinctId: userId,
  });
}
