import {api} from "@/lib/api-client";

export interface FamilyAltarPayload {
  nama_fa: string;
  kode_fa: string;
  area_id: string;
  address_fa: string;
  longitude: number;
  latitude: number;
  hari_fa: string;
  jam_fa: string;
}

export async function createFamilyAltar(payload: FamilyAltarPayload) {
  try {
    const response = await api.post("/family-altar", payload, {
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

export async function updateFamilyAltar(guid: string, payload: FamilyAltarPayload) {
  try {
    const response = await api.put(`/family-altar/${guid}`, payload, {
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
