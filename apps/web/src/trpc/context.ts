import type { WideEvent } from "@huddle/logger";

export type User = {
  id: string;
  isGuest: boolean;
  locale?: string;
  image?: string;
  timeZone?: string;
  isLegacyGuest: boolean;
};

export type TRPCContext = {
  user?: User;
  locale?: string;
  identifier?: string;
  event: WideEvent;
};
