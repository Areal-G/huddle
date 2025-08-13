import { isSelfHosted } from "@/lib/constants";

// Feedback goes to the Huddle team; there is nobody to receive it self-hosted
export const isFeedbackEnabled = !isSelfHosted;
