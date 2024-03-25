"use client";

import { DialogTrigger } from "@huddle/ui/dialog";

import { PayWallDialog } from "@/components/pay-wall-dialog";

export function UpgradeButton({ children }: React.PropsWithChildren) {
  return (
    <PayWallDialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
    </PayWallDialog>
  );
}
