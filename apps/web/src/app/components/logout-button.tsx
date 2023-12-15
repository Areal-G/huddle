"use client";
import type { ButtonProps } from "@huddle/ui/button";
import { Button } from "@huddle/ui/button";

import { useUser } from "@/components/user-provider";

export function LogoutButton({
  children,
  onClick,
  ...rest
}: React.PropsWithChildren<ButtonProps>) {
  const { logout } = useUser();
  return (
    <Button
      {...rest}
      onClick={async (e) => {
        await logout();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
}
