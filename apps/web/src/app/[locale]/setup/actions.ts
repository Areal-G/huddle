"use server";

import { refresh } from "next/cache";

import { headers } from "next/headers";
import * as z from "zod";
import { adoptOrphanedPolls } from "@/features/poll/mutations";
import { getOwnedSpace } from "@/features/space/data";
import { createSpace } from "@/features/space/mutations";
import { industrySchema } from "@/features/space/schema";
import { jobTitleSchema } from "@/features/user/schema";
import authLib from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action/server";

const setupSpaceSchema = z.discriminatedUnion("spaceType", [
  z.object({ spaceType: z.literal("personal") }),
  z.object({
    spaceType: z.literal("work"),
    organizationName: z.string().min(1).max(100),
    // Both optional: a required field against a guessed taxonomy forces bad
    // matches, and a skipped one reads as "none of these fit", which is
    // itself signal. Optionality is also what makes consent workable as the
    // legal basis for holding them.
    industry: industrySchema.optional(),
    jobTitle: jobTitleSchema.optional(),
  }),
]);

/**
 * Creates the user's space at the end of onboarding — registration doesn't
 * create one, so this is where every account gets theirs. Accounts that
 * already own a space (pre-existing accounts sent through setup to backfill
 * profile fields, or a re-submit) only re-persist the job title and retry
 * poll adoption: setup never renames or duplicates an existing space.
 */
export const setupSpaceAction = authActionClient
  .metadata({ actionName: "setup_space" })
  .inputSchema(setupSpaceSchema)
  .action(async ({ ctx, parsedInput }) => {
    const jobTitle =
      parsedInput.spaceType === "work" ? parsedInput.jobTitle : undefined;

    if (jobTitle) {
      // Written before the space, and before the early return below, so a
      // retry after a partial failure still persists it — the answer belongs
      // to the person, not to the space being created.
      //
      // Session-defined target, so the Better-Auth endpoint rather than a
      // mutation: it writes the row and refreshes the session snapshot and
      // cookie cache in one step.
      await authLib.api.updateUser({
        body: { jobTitle },
        headers: await headers(),
      });
    }

    const ownedSpace = await getOwnedSpace(ctx.user.id);

    if (ownedSpace) {
      // Create and adopt aren't atomic: a previous submit may have created
      // the space and failed before adoption, so retries still pull
      // orphaned polls in (a no-op when there are none).
      await adoptOrphanedPolls({
        userId: ctx.user.id,
        spaceId: ownedSpace.id,
      });
      refresh();
      return;
    }

    const name =
      parsedInput.spaceType === "work"
        ? parsedInput.organizationName
        : "Personal";

    const industry =
      parsedInput.spaceType === "work" ? parsedInput.industry : undefined;

    const space = await createSpace({
      name,
      ownerId: ctx.user.id,
      spaceType: parsedInput.spaceType,
      industry,
    });

    // Guest linking migrates polls without a space; pull them into the one
    // just created.
    await adoptOrphanedPolls({
      userId: ctx.user.id,
      spaceId: space.id,
    });

    if (industry) {
      // Re-run the classifier here rather than trusting an "inferred" value
      // posted by the form: the pair is what makes classifier accuracy
      // queryable, so that half has to be the server's own guess.
    }

    refresh();
  });
