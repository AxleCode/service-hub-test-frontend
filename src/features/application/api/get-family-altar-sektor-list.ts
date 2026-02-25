import { api } from "@/lib/api-client";

export interface FamilyAltarSektorListFilter {
  set_guid: boolean;
  guid: string;
  set_kode_sektor: boolean;
  kode_sektor: string;
  set_fa_id: boolean;
  fa_id: string;
  set_kode_fa: boolean;
  kode_fa: string;
  set_nama_fa: boolean;
  nama_fa: string;
  set_jamaah_id: boolean;
  jamaah_id: string;
  set_jamaah_name: boolean;
  fullname: string;
}

export interface FamilyAltarSektorListPayload {
  filter: FamilyAltarSektorListFilter;
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export interface FamilyAltarSektorListItem {
  guid: string;
  kode_wilayah: string;
  fa_id: string;
  kode_fa: string;
  nama_fa: string;
  jamaah_id: string;
  fullname: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface FamilyAltarSektorListResponse {
  data: FamilyAltarSektorListItem[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
}

export async function getFamilyAltarSektorList(payload: FamilyAltarSektorListPayload) {
  const response = await api.post("/family-altar-sektor/list", payload, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
}
