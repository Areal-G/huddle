export type EmailContext = {
  logoUrl: string;
  baseUrl: string;
  domain: string;
};

export const defaultEmailContext = {
  logoUrl: "https://huddle.dev/logo.png",
  baseUrl: "https://huddle.dev",
  domain: "huddle.dev",
};
