import NotificationEmail, {
  NotificationBaseProps,
} from "./components/notification-email";
import { Text } from "./components/styled-components";

export interface NewCommentEmailProps extends NotificationBaseProps {
  authorName: string;
}

export const NewCommentEmail = ({
  name = "Guest",
  title = "Untitled Poll",
  authorName = "Someone",
  pollUrl = "https://huddle.dev",
  unsubscribeUrl = "https://huddle.dev",
}: NewCommentEmailProps) => {
  return (
    <NotificationEmail
      name={name}
      title={title}
      pollUrl={pollUrl}
      unsubscribeUrl={unsubscribeUrl}
      preview={`${authorName} has commented on ${title}`}
    >
      <Text>
        <strong>{authorName}</strong> has commented on <strong>{title}</strong>.
      </Text>
    </NotificationEmail>
  );
};

export default NewCommentEmail;
