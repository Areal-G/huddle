import { previewEmailContext } from "../components/email-context";
import { NewCommentEmail } from "../templates/new-comment";

function NewCommentEmailPreview() {
  return (
    <NewCommentEmail
      title="Untitled Poll"
      authorName="Someone"
      pollUrl="https://huddle.dev"
      disableNotificationsUrl="https://huddle.dev"
      ctx={previewEmailContext}
    />
  );
}

export default NewCommentEmailPreview;
