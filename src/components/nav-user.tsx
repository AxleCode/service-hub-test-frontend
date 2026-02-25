"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  // CreditCard,
  Lock,
  LogOut,
  Moon,
  // Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { clearAllCookies } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { clearEncryptedCredentials } from "@/lib/secure-storage";

export function NavUser({ user }: { user?: any }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate({});
    clearAllCookies();
    clearEncryptedCredentials(); // Clear encrypted credentials from localStorage
    router.replace(paths.home.getHref());
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    if (isDark) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatars/shadcn.jpg" alt={user?.username} />
                <AvatarFallback className="rounded-lg">
                  {user?.jamaah_fullname
                    ?.split(" ")
                    .map((word: string) => word.charAt(0))
                    .join("") ?? ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.jamaah_fullname}</span>
                <span className="truncate text-xs">{user?.jamaah_email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/avatars/shadcn.jpg" alt={user?.username} />
                  <AvatarFallback className="rounded-lg">
                    {user?.jamaah_fullname
                      ?.split(" ")
                      .map((word: string) => word.charAt(0))
                      .join("") ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.jamaah_fullname}</span>
                  <span className="truncate text-xs">{user?.jamaah_email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>

              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setChangePasswordOpen(true)} className="cursor-pointer">
                <Lock />
                Change Password
              </DropdownMenuItem>

              <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
                <Moon />
                Toggle Dark Mode
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Change Password Form */}
      <ChangePasswordForm
        open={changePasswordOpen}
        onOpenChangeAction={setChangePasswordOpen}
      />
    </SidebarMenu>
  );
}
