import { cn } from "@huddle/ui";
import type * as React from "react";
import { CtaButton } from "@/components/home/cta-button";
import { handwritten } from "@/fonts/handwritten";

export function Cta({
  title,
  description,
  buttonLabel,
  hint,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  buttonLabel: React.ReactNode;
  hint: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-center">
        <h2 className="mx-auto max-w-[700px] text-balance font-medium text-2xl text-gray-800 leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-pretty text-base/6 text-gray-500 sm:text-lg">
          {description}
        </p>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <CtaButton size="lg" cta="final">
          {buttonLabel}
        </CtaButton>
        <p
          className={cn(
            "whitespace-nowrap text-gray-600 text-xs",
            handwritten.className,
            "decoration underline decoration-2 decoration-gray-300 underline-offset-8",
          )}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}
