// Error reporting without a third-party service: errors go to the console
// (server logs on the server, devtools in the browser). Stands in for the
// Sentry calls this app used to make.

export function captureException(error: unknown, context?: unknown) {
  console.error(error, ...(context === undefined ? [] : [context]));
}

export function captureMessage(message: string) {
  console.error(message);
}
