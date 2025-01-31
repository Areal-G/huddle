"use client";

import { Icon } from "@huddle/ui/icon";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@huddle/ui/sidebar";
import { HoverPrefetchLink } from "@/components/hover-prefetch-link";
import { useSpaceMenu } from "@/features/navigation/config";

export function SpaceSidebarMenu() {
  const { config } = useSpaceMenu();
  return (
    <>
      {config.sections.map((section) => {
        return (
          <SidebarGroup key={section.id}>
            {section.title && (
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <HoverPrefetchLink href={item.href}>
                          <Icon>
                            <item.icon />
                          </Icon>
                          {item.label}
                        </HoverPrefetchLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}
