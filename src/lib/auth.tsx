"use client";

import { Loader } from "lucide-react";
import { ReactNode } from "react";
import { configureAuth } from "react-query-auth";
import { z } from "zod";

import { auth, state } from "@/config/constants";
import { paths } from "@/config/paths";
import { useUsers } from "@/features/auth/api";
import { AuthUser } from "@/types/auth";
import { BaseResponse } from "@/types/base";

import { toDate } from "date-fns";
import { redirect, RedirectType } from "next/navigation";
import { api } from "./api-client";
import { getCookie, setCookie } from "./cookies";

export const loginInputSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export const forgotPasswordInputSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export const resetPasswordInputSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

const login = (data: LoginInput): Promise<BaseResponse<AuthUser>> => {
  return api.post(`/auth/login`, data);
};

const getUser = (): Promise<BaseResponse<AuthUser>> => {
  return api.post(`/auth/profile`);
};

const logout = () => {
  const token = getCookie(auth.token);
  return api.post(`/auth/logout`, {}, { headers: { token: token ?? "" } });
};

/** Ambil token dari berbagai bentuk response login/profile. */
function extractTokenFromResponse(response: unknown): string | undefined {
  const raw = response as Record<string, unknown>;
  const data = raw?.data as Record<string, unknown> | undefined;
  const resp = raw?.response as Record<string, unknown> | undefined;
  const dataData = data?.data as Record<string, unknown> | undefined;
  const token = (
    data?.token ??
    raw?.token ??
    resp?.token ??
    dataData?.token ??
    data?.access_token ??
    raw?.access_token
  ) as string | undefined;
  return typeof token === "string" && token.length > 0 ? token : undefined;
}

/** Simpan token dari response login ke cookie agar request berikutnya (GET dashboard, dll.) menyertakan header token */
function saveLoginToken(response: unknown) {
  const token = extractTokenFromResponse(response);
  if (!token) return;

  const raw = response as Record<string, unknown>;
  const data = (raw?.data ?? raw) as Record<string, unknown> | undefined;

  const tokenExpired = (data?.token_expired ?? raw?.token_expired) as string | undefined;
  const expires = tokenExpired ? toDate(tokenExpired) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  setCookie(auth.token, token, expires);
  if (tokenExpired) setCookie(auth.token_expired, String(tokenExpired), expires);

  const refreshToken = (data?.refresh_token ?? raw?.refresh_token) as string | undefined;
  const refreshExpired = (data?.refresh_token_expired ?? raw?.refresh_token_expired) as string | undefined;
  if (refreshToken) {
    const refreshExpires = refreshExpired ? toDate(refreshExpired) : expires;
    setCookie(auth.refresh_token, refreshToken, refreshExpires);
    if (refreshExpired) setCookie(auth.refresh_token_expired, String(refreshExpired), refreshExpires);
  }
}

const authConfig = {
  userFn: async () => {
    const response = await getUser();
    saveLoginToken(response);
    return response?.data;
  },
  loginFn: async (data: LoginInput) => {
    const response = await login(data);
    saveLoginToken(response);
    return response?.data;
  },
  // notes:
  // we aren't using this API for example.
  // if you need to set this function,
  // simply update this.
  registerFn: async (data: LoginInput) => {
    const response = await login(data);
    return response?.data;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout } = configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = getCookie(auth.logged_in);

  const { data: user, isLoading } = useUsers({ queryConfig: {} });

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader className="animate-spin text-primary-default" />
      </div>
    );
  }

  if (!user && !isLoading && isLoggedIn != state.loggedIn) {
    return redirect(
      paths.home.getHref(window.location.pathname),
      RedirectType.replace
    );
  }

  return children;
};

export const registerInputSchema = z.object({
  username: z.string().min(1, "Username is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(1, "Password is required"),
  confirm_password: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export type RegisterInput = z.infer<typeof registerInputSchema>;