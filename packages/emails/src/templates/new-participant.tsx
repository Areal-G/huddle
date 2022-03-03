import NotificationEmail, {
  NotificationBaseProps,
} from "./components/notification-email";
import { Text } from "./components/styled-components";

export interface NewParticipantEmailProps extends NotificationBaseProps {
  participantName: string;
}

export const NewParticipantEmail = ({
  name = "John",
  title = "Untitled Poll",
  participantName = "Someone",
  pollUrl = "https://huddle.dev",
  disableNotificationsUrl = "https://huddle.dev",
}: NewParticipantEmailProps) => {
  return (
    <NotificationEmail
      name={name}
      title={title}
      pollUrl={pollUrl}
      disableNotificationsUrl={disableNotificationsUrl}
      preview={`${participantName} has responded`}
    >
      <Text>
        <strong>{participantName}</strong> has responded to{" "}
        <strong>{title}</strong>.
      </Text>
    </NotificationEmail>
  );
};

export default NewParticipantEmail;
