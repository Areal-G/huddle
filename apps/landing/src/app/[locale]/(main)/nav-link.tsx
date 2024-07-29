"use client";

import { cn } from "@huddle/ui";
import { Button } from "@huddle/ui/button";
import { usePathname } from "next/navigation";
import { LinkBase } from "@/i18n/client/link";

export const NavLink = ({
  className,
  ...props
}: React.ComponentProps<typeof LinkBase>) => {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  return (
    <Button
      className={cn(isActive ? "bg-gray-200 text-foreground" : "", className)}
      asChild
      variant="ghost"
    >
      <LinkBase {...props} />
    </Button>
  );
};
