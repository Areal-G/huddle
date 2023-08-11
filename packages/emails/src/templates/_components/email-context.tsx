export type EmailContext = {
  logoUrl: string;
  baseUrl: string;
  domain: string;
  supportEmail: string;
};

export const defaultEmailContext = {
  logoUrl: "https://huddle-public.s3.amazonaws.com/images/huddle-logo-mark.png",
  baseUrl: "https://huddle.dev",
  domain: "huddle.dev",
  supportEmail: "support@huddle.dev",
};
