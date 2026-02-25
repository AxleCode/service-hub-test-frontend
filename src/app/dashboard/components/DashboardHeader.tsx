"use client";

import { ArrowLeft, Search, Sun, Maximize2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/auth";

export function DashboardHeader() {
  const { data: user } = useUser();

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
    <header className="sticky top-0 z-50 bg-background border-b flex h-16 shrink-0 items-center gap-4 px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">Dashboard</span>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
          <Sun className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{(user as any)?.jamaah_fullname}</span>
            <span className="text-xs text-muted-foreground leading-none mt-1">{(user as any)?.jamaah_email}</span>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src="/avatars/shadcn.jpg" alt={(user as any)?.jamaah_fullname || user?.username || "User"} />
            <AvatarFallback>
              {(user as any)?.jamaah_fullname
                ?.split(" ")
                .map((word: string) => word.charAt(0))
                .join("") || user?.username?.charAt(0)?.toUpperCase() || "JD"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

