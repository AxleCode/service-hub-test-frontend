import { api } from "@/lib/api-client";

export async function deleteFamilyAltar(guid: string) {
  try {
    const response = await api.delete(`/family-altar/${guid}`, {
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
