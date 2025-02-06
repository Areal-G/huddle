import type { WideEvent } from "@huddle/logger";

export type User = {
  id: string;
  isGuest: boolean;
  locale?: string;
  image?: string;
  timeZone?: string;
};

export type TRPCContext = {
  user?: User;
  locale?: string;
  identifier?: string;
  event: WideEvent;
};
