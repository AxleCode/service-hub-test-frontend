"use client";

import * as z from "zod";

/** Pastikan URL API punya protocol (http/https). Axios butuh full URL. */
function normalizeApiUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // localhost tanpa protocol → http (dev), selain itu → https
  if (/^localhost(\b|:)/i.test(trimmed) || /^127\.0\.0\.1(\b|:)/.test(trimmed)) {
    return `http://${trimmed}`;
  }
  return `https://${trimmed}`;
}

const createEnv = () => {
  const EnvSchema = z.object({
    APP_NAME: z.string(),
    API_URL: z.string(),
    SERVICE_NAME: z.string(),
    SECRET_KEY: z.string(),
    APP_URL: z.string().optional().default("http://localhost:3000"),
  });

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const envVars = {
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    API_URL: normalizeApiUrl(rawApiUrl),
    SERVICE_NAME: process.env.NEXT_PUBLIC_SERVICE_NAME,
    SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}
`
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
