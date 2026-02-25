/*
  Installed from github/Few-IT/few-it-registries/tree/master
*/

import Axios, { InternalAxiosRequestConfig } from "axios";
import { toDate } from "date-fns";

import { auth, responses } from "@/config/constants";
import { env } from "@/config/env";

import { clearAllCookies, getCookie, setCookie } from "@/lib/cookies";
import { generateToken, refreshToken } from "@/lib/token";
import { paths } from "@/config/paths";

const checkToken = async () => {
  let token = getCookie(auth.token);
  // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfbmFtZSI6IndpdC1kZXYiLCJkZXZpY2VfaWQiOiJwb3N0bWFuIiwiZGV2aWNlX3R5cGUiOiIwMDAwMDAxIiwiZXhwIjoxNzYyODY0OTQ1LCJpcF9hZGRyZXNzIjoiMC4wLjAuMCJ9.ZHLM1bbK5uC1QzEXvz5WfAeRfeKoKfmPTaJvDqAdTn0";
  if (!token) {
    const refresh_token = getCookie(auth.refresh_token);
    if (refresh_token) {
      try {
        const response = await refreshToken();
        if (response?.data?.message.en === responses.success) {
          token = response?.data?.data?.token || "";
          const expires = toDate(
            response?.data?.data?.token_expired || ""
          );
          const refresh_token_expires = toDate(
            response?.data?.data?.refresh_token_expired || ""
          );

          setCookie(auth.token, token, expires);
          setCookie(
            auth.token_expired,
            response?.data?.data?.token_expired || "",
            expires
          );
          setCookie(
            auth.refresh_token,
            response?.data?.data?.refresh_token || "",
            refresh_token_expires
          );
          setCookie(
            auth.refresh_token_expired,
            response?.data?.data?.refresh_token_expired || "",
            refresh_token_expires
          );

          return token;
        }
      } catch {
        // Refresh token failed, don't try to generate a new token
        return token;
      }
    }

    // Only generate a guest token if we're not trying to refresh an existing session
    // This prevents infinite loops when the session has expired
    try {
      const response = await generateToken();
      if (response?.data?.message.en === responses.success) {
        token = response?.data?.data?.token || "";
        const expires = toDate(
          response?.data?.data?.token_expired || ""
        );
        const refresh_token_expires = toDate(
          response?.data?.data?.refresh_token_expired || ""
        );

        setCookie(auth.token, token, expires);
        setCookie(
          auth.token_expired,
          response?.data?.data?.token_expired || "",
          expires
        );
        setCookie(
          auth.refresh_token,
          response?.data?.data?.refresh_token || "",
          refresh_token_expires
        );
        setCookie(
          auth.refresh_token_expired,
          response?.data?.data?.refresh_token_expired || "",
          refresh_token_expires
        );
      }
    } catch {
      // Token generation failed, return empty token
      // This will prevent infinite loop attempts
      return token;
    }
  }

  return token;
};

async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  const token = await checkToken();
  config.headers.token = token;

  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const previousRequest = error.config;
    const message = error.response?.data?.message?.en;

    // Hanya cek token expired/unauthorized jika ada message (hindari toLowerCase of undefined)
    const isAuthError =
      typeof message === "string" &&
      (message.toLowerCase() === responses.pleaseLoginFirst.toLowerCase() ||
        message.toLowerCase() === responses.unauthorizedToken.toLowerCase());

    if (isAuthError) {
      if (previousRequest._retry) {
        // Already retried, reject to avoid infinite loop
        clearAllCookies();
        window.location.href = paths.home.getHref();
        return Promise.reject(error);
      }
      previousRequest._retry = true;

      // refresh token
      let token = getCookie(auth.refresh_token);

      if (token) {
        const response = await refreshToken();
        if (response?.data?.message.en === responses.success) {
          token = response?.data?.data?.token || "";
          // console.log("token", token);
          // console.log("response?.data?.data?.token_expired", response?.data?.data?.token_expired);
          const expires = toDate(
            response?.data?.data?.token_expired || ""
          );

          setCookie(auth.token, token, expires);
          setCookie(
            auth.token_expired,
            response?.data?.data?.token_expired || "",
            expires
          );
          // setCookie(
          //   auth.refresh_token,
          //   response?.data?.data?.refresh_token || "",
          //   expires
          // );
          // setCookie(
          //   auth.refresh_token_expired,
          //   response?.data?.data?.refresh_token_expired || "",
          //   expires
          // );

          // Update token header and retry original request
          previousRequest.headers.token = token;
          return api(previousRequest);
        } else {
          clearAllCookies();
          window.location.href = paths.home.getHref();
          return Promise.reject(error);
        }
      } else {
        // No refresh token available, clear and redirect
        clearAllCookies();
        window.location.href = paths.home.getHref();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
