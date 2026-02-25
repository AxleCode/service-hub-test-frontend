"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { useNavMain } from "@/context/nav-main-context";
import { useLogout, useUser } from "@/lib/auth";
import { clearAllCookies } from "@/lib/cookies";
import { clearEncryptedCredentials } from "@/lib/secure-storage";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { data: user } = useUser();
  const { navMain, loading, error } = useNavMain();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate({});
    clearAllCookies();
    clearEncryptedCredentials();
    router.replace(paths.home.getHref());
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="relative h-30 w-full">
          <Image
            src="/image/ic_bpro.png"
            alt="BPRO"
            fill
            className="object-contain invert dark:invert-0"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {loading && (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
        {error && <div>{error}</div>}
        {navMain && <NavMain items={navMain} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
        <SidebarMenu>
          <SidebarMenuItem>
            
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
