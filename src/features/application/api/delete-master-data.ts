import { api } from "@/lib/api-client";

export async function deleteMasterData(guid: string) {
  try {
    const response = await api.delete(`/masterdata_value/${guid}`, {
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
