import { cn } from "@huddle/ui";
import { Icon } from "@huddle/ui/icon";

export function EmptyState({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyStateIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex rounded-full border p-4">
      <Icon size="xl">{children}</Icon>
    </div>
  );
}

export function EmptyStateTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-semibold">{children}</p>;
}

export function EmptyStateDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-muted-foreground mt-1 text-sm">{children}</p>;
}

export function EmptyStateFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6">{children}</div>;
}
