import type { VoteType } from "@huddle/database";

export interface ParticipantForm {
  votes: Array<
    | {
        optionId: string;
        type?: VoteType;
      }
    | undefined
  >;
}

export interface ParticipantFormSubmitted {
  votes: Array<{ optionId: string; type: VoteType }>;
}
