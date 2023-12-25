import type { EmailClient } from "@huddle/emails";

export type TRPCContext = {
  user: {
    id: string;
    isGuest: boolean;
    locale?: string;
    getEmailClient: (locale?: string) => EmailClient;
    image?: string;
    email?: string;
  };
  ip?: string;
};
