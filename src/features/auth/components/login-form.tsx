"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LoginInput, loginInputSchema, useLogin } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "@/config/paths";
import { isAxiosError } from "axios";
import { useLayoutEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies";
import { auth, state } from "@/config/constants";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import ForgotPasswordForm from "./forgot-password-form";
import { saveEncryptedCredentials } from "@/lib/secure-storage";
import RegisterForm from "./register-form";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const isLoggedIn = getCookie(auth.logged_in);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const login = useLogin({
    onSuccess: async (data) => {
      if (data) {
        setCookie(
          auth.logged_in,
          state.loggedIn,
          new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        );

        // Save encrypted credentials to localStorage
        try {
          const formData = form.getValues();
          await saveEncryptedCredentials(formData.username, formData.password);
          console.log("Credentials saved securely");
        } catch (error) {
          console.error("Failed to save credentials:", error);
          // Don't block login if credential storage fails
        }

        // Dispatch custom event to notify nav context about login
        window.dispatchEvent(new CustomEvent('userLoggedIn'));

        console.log("Login success, redirecting...");
        if (redirectTo) {
          console.log("Redirecting to redirectTo:", redirectTo);
          router.replace(redirectTo);
          return;
        }
        console.log("Redirecting to dashboard");
        router.replace(paths.dashboard.root.getHref());
        return;
      }
    },
    onError: (error) => {
      // Always log full error for debugging (lihat di DevTools → Console)
      console.error("[Login Error]", error);

      if (isAxiosError(error)) {
        const errorMessage = error?.response?.data?.response?.message_en || error?.response?.data?.message?.en || "Login failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        // Tampilkan error asli jika ada (misal dari network/JS), fallback ke pesan generik
        const message =
          error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
        setError(message);
        toast.error(message);
      }
    },
  });

  const onSubmit = (data: LoginInput) => {
    login.mutate(data);
  };

  // Handle form validation errors
  const handleFormError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  useLayoutEffect(() => {
    if (isLoggedIn) {
      if (redirectTo) {
        router.replace(redirectTo);
        return;
      }
      router.replace(paths.dashboard.root.getHref());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, redirectTo]);

  if (showForgotPassword) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForgotPassword(false)}
            className="p-0 h-auto text-primary hover:text-primary/80"
          >
            ← Back to Login
          </Button>
        </div>
        <ForgotPasswordForm
          onSuccessAction={() => setShowForgotPassword(false)}
        />
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRegister(false)}
            className="p-0 h-auto text-primary hover:text-primary/80"
          >
            ← Back to Login
          </Button>
        </div>
        <RegisterForm onNavigateToLogin={() => setShowRegister(false)} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit, handleFormError)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your username below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <FormLabel htmlFor="identifier">Username</FormLabel>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your username"
                    required
                    {...field}
                    className="pr-10"
                  />
                </>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {

                return (
                  <>
                    <div className="relative">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Input Your Password"
                        required
                        {...field}
                        className="pr-10 mt-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 pt-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.11-2.22 3.11-4.11 5.5-5.5" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                );
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span></span>
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
             
            </div>
           
          </div>
          {Boolean(error) && (
            <span className="text-red-500 text-sm">{String(error)}</span>
          )}
          {login.isPending ? <div className="flex justify-center items-center">
            <Loader className="animate-spin text-primary-default" />
          </div>
            : <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Loading..." : "Login"}
            </Button>}

            <div className="flex flex-col items-center text-center">
              <p className="text-muted-foreground text-sm text-balance">Or</p>
            </div>


            <div className="flex flex-col items-end ">
              <Button
                type="button"
                variant="default"
                className="w-full"
                onClick={() => setShowRegister(true)}
              >
                Register
              </Button>
            </div>
        </div>
        {/* <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-muted-foreground text-sm text-balance">
            Or
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>

        </div> */}
      </form>
    </Form>
  );
}
