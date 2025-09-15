import { isSelfHosted } from "@/lib/constants";

// Review sites list the Huddle cloud product; self-hosted users are asked
// through the README and the license email instead
export const isReviewRequestEnabled = !isSelfHosted;

// G2 first: splitting a few reviews a week across sites leaves both too thin
// for G2's badges. Add Capterra once G2 has enough reviews.
export const reviewRequestUrl =
  "https://www.g2.com/products/huddle/review_modalities/new?utm_source=huddle&utm_medium=in-app&utm_campaign=review-request";
