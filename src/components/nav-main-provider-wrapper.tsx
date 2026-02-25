"use client";

import { NavMainProvider } from "@/context/nav-main-context";

export default function NavMainProviderWrapper({ children }: { children: React.ReactNode }) {
  return <NavMainProvider>{children}</NavMainProvider>;
}
