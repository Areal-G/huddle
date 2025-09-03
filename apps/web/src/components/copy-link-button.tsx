"use client";

import { Button } from "@huddle/ui/button";
import { toast } from "@huddle/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@huddle/ui/tooltip";
import { LinkIcon } from "lucide-react";
import { useCopyToClipboard } from "react-use";

import { useTranslation } from "@/i18n/client";

export function CopyLinkButton({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const [, copy] = useCopyToClipboard();
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={t("copyLink", { defaultValue: "Copy link" })}
            className={className}
            variant="ghost"
            size="icon"
            onClick={() => {
              copy(href);
              toast.success(t("linkCopied", { defaultValue: "Link copied" }));
            }}
          >
            <LinkIcon className="text-muted-foreground" />
          </Button>
        }
      />
      <TooltipContent>
        <p>{t("copyLink", { defaultValue: "Copy link" })}</p>
      </TooltipContent>
    </Tooltip>
  );
}
