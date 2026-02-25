import { api } from "@/lib/api-client";

export async function deleteFamilyAltarWilayah(guid: string) {
  try {
    const response = await api.delete(`/family-altar-wilayah/${guid}`, {
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

export async function deleteFamilyAltarSektor(guid: string) {
  try {
    const response = await api.delete(`/family-altar-sektor/${guid}`, {
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

export async function deleteFamilyAltarAnggota(guid: string) {
  try {
    const response = await api.delete(`/family-altar-anggota/${guid}`, {
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