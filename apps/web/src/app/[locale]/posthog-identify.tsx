"use client";
import { usePostHog } from "@huddle/posthog/client";
import { useTheme } from "@huddle/ui/theme-provider";
import useMount from "react-use/lib/useMount";

export function PostHogIdentify({ distinctId }: { distinctId?: string }) {
  const posthog = usePostHog();
  const { theme } = useTheme();
  useMount(() => {
    if (posthog && distinctId) {
      posthog.identify(distinctId, {
        theme,
      });
    }
  });

  return null;
}
