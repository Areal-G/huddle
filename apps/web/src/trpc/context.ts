import type { EmailClient } from "@huddle/emails";

type User = {
  id: string;
  isGuest: boolean;
  locale?: string;
  getEmailClient: (locale?: string) => EmailClient;
  image?: string;
};

export type TRPCContext = {
  user?: User;
  locale?: string;
  ip?: string;
};
