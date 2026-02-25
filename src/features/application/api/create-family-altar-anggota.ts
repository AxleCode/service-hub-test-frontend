import { api } from "@/lib/api-client";

export interface CreateFamilyAltarAnggotaPayload {
  fa_id: string;
  jamaah_id: string;
  // wilayah_id: string;
  // sektor_id: string;
  pengurus_id: string;
}

export async function createFamilyAltarAnggota(payload: CreateFamilyAltarAnggotaPayload) {
  try {
    const response = await api.post(
      "/family-altar-anggota",
      payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to create family altar anggota:", error);
    throw error;
  }
}
