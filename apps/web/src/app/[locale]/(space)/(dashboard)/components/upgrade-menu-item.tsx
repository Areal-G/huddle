"use client";

import { usePostHog } from "@huddle/posthog/client";
import { SidebarMenuButton, SidebarMenuItem } from "@huddle/ui/sidebar";
import { SparklesIcon } from "lucide-react";
import { useIsFree } from "@/features/billing/client";
import { showPayWall } from "@/features/billing/paywall-store";
import { Trans } from "@/i18n/client";

export function UpgradeMenuItem() {
  const isFree = useIsFree();
  const posthog = usePostHog();

  if (!isFree) {
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        variant="primary"
        onClick={() => {
          posthog?.capture("space_sidebar:upgrade_button_click");
          showPayWall();
        }}
      >
        <SparklesIcon />
        <Trans i18nKey="upgradeToPro" defaults="Upgrade to Pro" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
