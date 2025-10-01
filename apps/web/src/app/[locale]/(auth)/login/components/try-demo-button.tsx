"use client";

import { Button } from "@huddle/ui/button";
import React from "react";
import { useTranslation } from "@/i18n/client";
import { signInAsDemo } from "../actions";

export function TryDemoButton() {
  const { t } = useTranslation();
  const [isPending, startTransition] = React.useTransition();
  const [failed, setFailed] = React.useState(false);

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="primary"
        size="lg"
        loading={isPending}
        onClick={() =>
          startTransition(async () => {
            setFailed(false);
            const res = await signInAsDemo();
            if (res.ok) {
              window.location.href = "/";
            } else {
              setFailed(true);
            }
          })
        }
      >
        {t("tryDemo", { defaultValue: "Try the demo" })}
      </Button>
      <p className="text-center text-muted-foreground text-xs">
        {failed
          ? t("tryDemoFailed", {
              defaultValue: "The demo account is not available right now.",
            })
          : t("tryDemoDescription", {
              defaultValue:
                "Explore a sample workspace with polls, votes and comments. No sign-up needed.",
            })}
      </p>
    </div>
  );
}
