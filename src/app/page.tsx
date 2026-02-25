"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/features/auth/components/login-form"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-6 md:p-10 bg-background">
        <div className="flex min-h-full flex-col items-center justify-center py-8">
          <div className="w-full max-w-md min-w-0 px-1">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="flex h-full items-center justify-center font-semibold text-muted-foreground">
          Service Hub
        </div>
      </div>
    </div>
  );
}