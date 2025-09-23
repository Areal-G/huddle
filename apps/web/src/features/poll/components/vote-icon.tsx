"use client";

import type { VoteType } from "@huddle/database";
import {
  AnimatedVoteIcon,
  VoteIcon as BaseVoteIcon,
} from "@huddle/ui/vote-icon";
import { useTranslation } from "@/i18n/client";

const VoteIcon = ({
  type,
  size = "md",
  className,
  animated = false,
}: {
  type?: VoteType;
  size?: "sm" | "md";
  className?: string;
  /** Morph between shapes when `type` changes, for controls that cycle the vote. */
  animated?: boolean;
}) => {
  const { t } = useTranslation();

  const title = type
    ? {
        yes: t("yes", { defaultValue: "Yes" }),
        ifNeedBe: t("ifNeedBe", { defaultValue: "If need be" }),
        no: t("no", { defaultValue: "No" }),
      }[type]
    : t("pending", { defaultValue: "Pending" });

  const Icon = animated ? AnimatedVoteIcon : BaseVoteIcon;

  return (
    <Icon
      type={type ?? "pending"}
      size={size}
      title={title}
      className={className}
    />
  );
};

export default VoteIcon;
