"use client";

import { cn } from "@huddle/ui";
import type { AvatarProps } from "@huddle/ui/avatar";
import { Avatar, AvatarFallback } from "@huddle/ui/avatar";

type SpaceIconProps = {
  name: string;
  className?: string;
} & AvatarProps;

export function SpaceIcon({ name, className, size }: SpaceIconProps) {
  return (
    <Avatar className={cn(className)} size={size}>
      <AvatarFallback seed={name}>{name[0]}</AvatarFallback>
    </Avatar>
  );
}
