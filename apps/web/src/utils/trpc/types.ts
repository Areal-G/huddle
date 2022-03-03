import { Option, User } from "@huddle/database";

export type GetPollApiResponse = {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  options: Option[];
  user: User | null;
  timeZone: string | null;
  adminUrlId: string;
  participantUrlId: string;
  closed: boolean;
  legacy: boolean;
  demo: boolean;
  createdAt: Date;
  deleted: boolean;
};
