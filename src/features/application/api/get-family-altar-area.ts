import { api } from "@/lib/api-client";

export async function getFamilyAltarArea(payload: any) {
  try {
    const response = await api.post("/masterdata_value/list", payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
