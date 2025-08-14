import type { WideEvent } from "@huddle/logger";
import type { UserDTO } from "@/features/user/schema";

export type TRPCContext = {
  user?: UserDTO;
  locale?: string;
  identifier?: string;
  event?: WideEvent;
};
