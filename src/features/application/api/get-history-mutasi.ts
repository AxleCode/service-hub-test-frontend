import { api } from "@/lib/api-client";

interface Filter {
  set_guid: boolean;
  guid: string;
  set_family_altar_join_anggota_id: boolean;
  family_altar_join_anggota_id: string;
  set_old_fa_id: boolean;
  old_fa_id: string;
  set_new_fa_id: boolean;
  new_fa_id: string;
  set_old_jamaah_id: boolean;
  old_jamaah_id: string;
  set_new_jamaah_id: boolean;
  new_jamaah_id: string;
  set_old_status: boolean;
  old_status: string;
  set_new_status: boolean;
  new_status: string;
  set_created_at_start: boolean;
  created_at_start: string;
  set_created_at_end: boolean;
  created_at_end: string;
}

interface Payload {
  filter: Filter;
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export async function getHistoryMutasi(payload: Payload) {
  try {
    const response = await api.post("/family-altar-anggota/log/list", payload, {
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


