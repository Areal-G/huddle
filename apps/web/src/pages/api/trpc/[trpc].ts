import { trpcNextApiHandler } from "@huddle/backend/next/trpc/server";

export const config = {
  api: {
    externalResolver: true,
  },
};
// export API handler
export default trpcNextApiHandler;
