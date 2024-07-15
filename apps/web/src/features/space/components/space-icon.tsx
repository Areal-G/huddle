"use client";

import { cn } from "@huddle/ui";
import type { AvatarProps } from "@huddle/ui/avatar";
import { Avatar, AvatarFallback } from "@huddle/ui/avatar";
import Image from "next/image";

type SpaceIconProps = {
  name: string;
  className?: string;
  src?: string;
} & AvatarProps;

export function SpaceIcon({ name, src, className, size }: SpaceIconProps) {
  return (
    <Avatar className={cn(className)} size={size}>
      {src ? (
        <Image
          src={`/api/storage/${src}`}
          width={128}
          height={128}
          alt={name}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <AvatarFallback seed={name}>
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
