import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/context/query-context";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Service Hub",
  description: "Service Hub Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Toaster />
          <LayoutWrapper>{children}</LayoutWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}