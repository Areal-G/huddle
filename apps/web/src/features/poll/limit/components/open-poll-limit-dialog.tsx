"use client";

import { buttonVariants } from "@huddle/ui";
import { Button } from "@huddle/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useDialog,
} from "@huddle/ui/dialog";
import { usePathname } from "next/navigation";
import React from "react";
import { Link } from "@/components/link";
import { LoginLink } from "@/components/login-link";
import { primePayWall, usePayWallStore } from "@/features/billing/client";
import { PayWallDialog } from "@/features/billing/components/pay-wall-dialog";
import { PLAN_NAMES } from "@/features/billing/constants";
import { useOpenPollLimitStore } from "@/features/poll/limit/client";
import { OpenPollUsageBar } from "@/features/poll/limit/components/open-poll-usage-bar";
import type { OpenPollUsage } from "@/features/poll/limit/types";
import { Trans } from "@/i18n/client";

/**
 * Single, app-wide instance. Open it from anywhere with
 * `showOpenPollLimit()`.
 */
export function OpenPollLimitDialog() {
  const isOpen = useOpenPollLimitStore((state) => state.isOpen);
  const content = useOpenPollLimitStore((state) => state.content);
  const hide = useOpenPollLimitStore((state) => state.hide);
  // A refused reopen or duplicate leaves the organizer on a page that still
  // works, so it can be dismissed. On /new there is nothing left to do but
  // make room, register or upgrade, so the only ways out are its own links.
  const dismissible = content !== null && content.source !== "create";

  // The dialog's links close it by leaving the page, which keeps it up if
  // that navigation fails or is cancelled. Each layout mounts its own
  // instance, so one on another page must never open, even for a moment.
  const pathname = usePathname();
  const isOnOpeningPage = content !== null && content.pathname === pathname;
  React.useEffect(() => {
    if (isOpen && !isOnOpeningPage) {
      hide();
    }
  }, [isOpen, isOnOpeningPage, hide]);

  return (
    <Dialog
      open={isOpen && isOnOpeningPage}
      disablePointerDismissal={!dismissible}
      onOpenChange={(open) => {
        if (!open && dismissible) {
          hide();
        }
      }}
    >
      <DialogContent size="lg" showCloseButton={dismissible}>
        {content ? <OpenPollLimitContent usage={content.usage} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function OpenPollLimitContent({ usage: data }: { usage: OpenPollUsage }) {
  // The pay wall nests here so it stacks above this dialog and this dialog
  // is still there when the pay wall closes.
  const payWall = useDialog();
  const payWallPricing = usePayWallStore((state) => state.pricing);

  if (data.limit === null) {
    return null;
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-semibold text-lg">
          <Trans
            i18nKey="openPollLimitReachedTitle"
            defaults="Open poll limit reached"
          />
        </DialogTitle>
        <DialogDescription className="mt-1">
          {data.tier === "guest" ? (
            <Trans
              i18nKey="openPollLimitGuestDescription"
              defaults="Guests can have one open poll at a time. Finalize or close polls to make room, or log in to increase your limit."
            />
          ) : (
            <Trans
              i18nKey="openPollLimitFreeDescription"
              defaults="{planName} includes up to {limit} open polls at a time. Finalize or close polls to make room, or upgrade for unlimited open polls."
              values={{ planName: PLAN_NAMES.HOBBY, limit: data.limit }}
            />
          )}
        </DialogDescription>
      </DialogHeader>
      <OpenPollUsageBar openCount={data.openCount} limit={data.limit} />
      <DialogFooter>
        {data.tier !== "guest" ? (
          <Link href="/polls" className={buttonVariants()}>
            <Trans i18nKey="goToPolls" defaults="Go to polls" />
          </Link>
        ) : null}
        <OpenPollLimitActions
          usage={data}
          onUpgradeClick={() => {
            primePayWall({ from: "poll-limit" });
            payWall.trigger();
          }}
        />
      </DialogFooter>
      <PayWallDialog
        pricing={payWallPricing}
        isOpen={payWall.dialogProps.open}
        onOpenChange={payWall.dialogProps.onOpenChange}
      />
    </>
  );
}

function OpenPollLimitActions({
  usage,
  onUpgradeClick,
}: {
  usage: OpenPollUsage;
  onUpgradeClick: () => void;
}) {
  if (usage.tier === "guest") {
    return (
      <LoginLink className={buttonVariants({ variant: "primary" })}>
        <Trans i18nKey="logInOrSignUp" defaults="Log in or sign up" />
      </LoginLink>
    );
  }

  if (usage.tier === "hobby") {
    return (
      <Button variant="primary" onClick={onUpgradeClick}>
        <Trans i18nKey="upgrade" defaults="Upgrade" />
      </Button>
    );
  }

  return null;
}
