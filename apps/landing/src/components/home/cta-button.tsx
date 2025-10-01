"use client";
import { buttonVariants, cn } from "@huddle/ui";
import Link from "next/link";
import type React from "react";
import { linkToApp } from "@/lib/linkToApp";
import { useRefSlug } from "@/lib/use-ref-slug";

export function CtaButton({
  cta,
  size = "xl",
  className,
  children,
}: {
  cta: string;
  size?: "default" | "lg" | "xl";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRefSlug();
  return (
    <Link
      href={linkToApp("/new", { ref, cta })}
      className={buttonVariants({
        size,
        variant: "primary",
        className: cn("shadow-md transition-all active:shadow-none", className),
      })}
    >
      {children}
    </Link>
  );
}
