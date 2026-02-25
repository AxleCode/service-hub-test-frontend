import { api } from "@/lib/api-client";

export interface FamilyAltarWilayahListRequest {
  filter: {
    set_guid: boolean;
    guid: string;
    set_kode_wilayah: boolean;
    kode_wilayah: string;
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
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export async function getFamilyAltarWilayahList(requestBody: FamilyAltarWilayahListRequest) {
  const response = await api.post("/family-altar-wilayah/list", requestBody, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
}
