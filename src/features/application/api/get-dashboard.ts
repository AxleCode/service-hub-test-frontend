import { api } from "@/lib/api-client";
import { DashboardResponse } from "@/features/application/types/dashboard";

export async function getDashboard(): Promise<DashboardResponse> {
  try {
    const response = await api.post("/jamaah/my-journey/dashboard", {}, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response as unknown as DashboardResponse;
  } catch (error) {
    throw error;
  }
}

