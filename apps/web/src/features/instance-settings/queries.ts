"server-only";
import { prisma } from "@huddle/database";
import { cache } from "react";

export const getInstanceSettings = cache(async () => {
  const instanceSettings = await prisma.instanceSettings.findUnique({
    where: {
      id: 1,
    },
    select: {
      disableUserRegistration: true,
    },
  });

  return {
    disableUserRegistration: instanceSettings?.disableUserRegistration ?? false,
  };
});
