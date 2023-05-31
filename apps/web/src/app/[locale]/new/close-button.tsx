"use client";

import { Button } from "@huddle/ui/button";
import { Icon } from "@huddle/ui/icon";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.back();
      }}
      variant="ghost"
    >
      <Icon>
        <XIcon />
      </Icon>
    </Button>
  );
}
