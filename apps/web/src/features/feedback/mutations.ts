import "server-only";

import { sendRawEmail } from "@huddle/emails";
import { track } from "@/lib/posthog";

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

  // Feedback is only reachable through authActionClient, which rejects guests.
  track({ id: userId, isGuest: false }, { event: "feedback_send" });
}
