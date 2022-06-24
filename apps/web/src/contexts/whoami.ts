import { trpc } from "@huddle/backend";

export const useWhoAmI = () => {
  const { data: whoAmI } = trpc.whoami.get.useQuery();
  return whoAmI;
};
