"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMainProvider } from "@/context/nav-main-context";
import { ProtectedRoute } from "@/lib/auth";
import { paths } from "@/config/paths";
import { usePathname } from "next/navigation";

/** Halaman yang boleh diakses tanpa login (login, register, forgot-password) */
const isPublicRoute = (pathname: string) =>
  pathname === paths.home.path ||
  pathname === paths.register.path ||
  pathname.startsWith("/forgot-password");

export const decodeHtmlEntities = (text: string): string => {
  if (typeof window === "undefined") return text;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Halaman publik: tidak tampilkan sidebar, tidak cek login
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  // Generate breadcrumb from pathname (decode URL + HTML entities e.g. PURITY%202025 → PURITY 2025)
  const getBreadcrumbName = (path: string): string => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    const lastSegment = segments[segments.length - 1];
    let decoded = lastSegment;
    try {
      decoded = decodeHtmlEntities(decodeURIComponent(lastSegment));
    } catch {
      decoded = decodeHtmlEntities(lastSegment);
    }
    return decoded
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <ProtectedRoute>
      <NavMainProvider>
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        {/* Hide header and breadcrumb on Dashboard page - Uncomment to show */}
        {pathname !== "/dashboard" && (
          <header className="sticky top-0 z-50 bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== "/dashboard" && (
                    <>
                      <span className="mx-2 text-gray-400">/</span>
                      <BreadcrumbItem className="hidden md:block">
                        <span className="text-sm">{getBreadcrumbName(pathname)}</span>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
        )}
        <div className={`flex flex-1 flex-col ${pathname === "/dashboard" ? "h-full" : "gap-4 p-4 pt-0"}`}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </NavMainProvider>
    </ProtectedRoute>
  );
}

