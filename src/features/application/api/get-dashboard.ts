import type { WeatherDashboardResponse } from "@/features/application/types/dashboard";
import { api } from "@/lib/api-client";

export interface DashboardPayload {
  longitude: string;
  latitude: string;
}

/** Endpoint cuaca. Ubah jika backend memakai path lain. */
export const DASHBOARD_WEATHER_ENDPOINT = "/check-weather/info";

/**
 * POST dengan body JSON { "longitude": "112.7521", "latitude": "-7.2575" }.
 * Banyak server/proxy mengabaikan body pada GET, sehingga nilai tidak sampai ke backend.
 * Pastikan backend menerima POST dan membaca req.body.latitude & req.body.longitude.
 */
export async function getDashboard(payload: DashboardPayload): Promise<WeatherDashboardResponse> {
  const body = {
    longitude: String(payload.longitude),
    latitude: String(payload.latitude),
  };
  const response = await api.post(DASHBOARD_WEATHER_ENDPOINT, body, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response as unknown as WeatherDashboardResponse;
}
