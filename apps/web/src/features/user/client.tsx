"use client";
import { useRouter } from "next/navigation";
import React from "react";
import type { UserAbility } from "@/features/user/ability";
import { defineAbilityFor } from "@/features/user/ability";
import type { UserDTO } from "@/features/user/schema";
import type { GuestSessionResult } from "@/features/user/utils";
import { toGuestSessionResult } from "@/features/user/utils";
import { authClient } from "@/lib/auth-client";
import { isOwner } from "@/lib/utils/permissions";

const UserContext = React.createContext<UserDTO | null | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: UserDTO | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

/**
 * For components rendered on routes gated by a logged-in (non-guest) user
 * (e.g. behind loadUser). Throws instead of returning null so consumers
 * don't need to handle the unauthenticated case.
 */
export function useAuthedUser() {
  const user = React.useContext(UserContext);

  if (user === undefined) {
    throw new Error("useAuthedUser must be used within a UserProvider");
  }

  if (!user || user.isGuest) {
    throw new Error(
      "useAuthedUser was rendered on a route without a logged in user. Components that call it belong on login-gated routes.",
    );
  }

  return user;
}

export function useUser() {
  const user = React.useContext(UserContext);
  const router = useRouter();

  if (user === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return React.useMemo(() => {
    return {
      user: user ?? undefined,
      createGuestIfNeeded: async (): Promise<GuestSessionResult> => {
        if (user) return { ok: true };

        let result: GuestSessionResult;
        try {
          const { error } = await authClient.signIn.anonymous();
          result = toGuestSessionResult(error);
          if (result.ok) {
            // A browser that blocks cookies drops Set-Cookie and still
            // reports success, so only reading the session back proves it.
            const { data: session } = await authClient.getSession();
            if (!session?.user) {
              result = { ok: false, reason: "sessionUnavailable" };
            }
          }
        } catch {
          result = { ok: false, reason: "sessionUnavailable" };
        }

        if (result.ok) router.refresh();
        return result;
      },
      getAbility: (): UserAbility => defineAbilityFor(user ?? undefined),
      ownsObject: (resource: { userId?: string | null }) => {
        return user ? isOwner(resource, { id: user.id }) : false;
      },
    };
  }, [user, router]);
}
