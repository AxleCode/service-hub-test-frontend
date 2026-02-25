import { api } from "@/lib/api-client";

export interface UpdateFamilyAltarAnggotaPayload {
  fa_id: string;
  jamaah_id: string;
  // wilayah_id: string;
  // sektor_id: string;
  pengurus_id: string;
}

export async function updateFamilyAltarAnggota(guid: string, payload: UpdateFamilyAltarAnggotaPayload) {
  try {
    const response = await api.put(`/family-altar-anggota/${guid}`, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
