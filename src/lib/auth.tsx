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

import { redirect, RedirectType } from "next/navigation";
import { api } from "./api-client";
import { getCookie } from "./cookies";

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

const authConfig = {
  userFn: async () => {
    const response = await getUser();
    return response?.data;
  },
  loginFn: async (data: LoginInput) => {
    const response = await login(data);
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