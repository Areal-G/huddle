import { previewEmailContext } from "../components/email-context";
import { SpaceInviteEmail } from "../templates/space-invite";

export default function SpaceInvitePreview() {
  return (
    <SpaceInviteEmail
      spaceName="Marketing Team"
      inviterName="John Smith"
      spaceRole="member"
      inviteUrl="https://huddle.dev/invite/abc123"
      ctx={previewEmailContext}
    />
  );
}
