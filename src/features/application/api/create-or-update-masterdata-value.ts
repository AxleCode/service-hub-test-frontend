import { api } from "@/lib/api-client";

export interface MasterdataValuePayload {
  guid?: string;
  reference_id?: number;
  category: string;
  value: string;
}

export async function createOrUpdateMasterdataValue(
  payload: MasterdataValuePayload,
  method: "POST" | "PUT" = "POST"
) {
  try {
    const endpoint =
      method === "PUT" ? "/masterdata_value/update" : "/masterdata_value/create";
    
    const response = await api({
      url: endpoint,
      method,
      data: payload,
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
