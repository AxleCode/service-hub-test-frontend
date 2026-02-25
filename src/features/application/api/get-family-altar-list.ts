import { api } from "@/lib/api-client";

interface FamilyAltarFilter {
  set_guid?: boolean;
  guid?: string;
  set_kode_fa?: boolean;
  kode_fa?: string;
  set_nama_fa?: boolean;
  nama_fa?: string;
  set_area_id?: boolean;
  area_id?: string;
  set_area_name?: boolean;
  area_name?: string;
  set_hari_fa?: boolean;
  hari_fa?: string;
  set_fa_wilayah_id?: boolean;
  fa_wilayah_id?: string;
  set_kode_wilayah?: boolean;
  kode_wilayah?: string;
  set_fa_sektor_id?: boolean;
  fa_sektor_id?: string;
  set_kode_sektor?: boolean;
  kode_sektor?: string;
}

interface FamilyAltarListPayload {
  filter: FamilyAltarFilter;
  limit: number;
  page: number;
  order: string;
  sort: string;
}

interface FamilyAltarItem {
  guid: string;
  nama_fa: string;
  // other fields can be added if needed
}

interface FamilyAltarListResponse {
  data: FamilyAltarItem[];
  // other response fields can be added if needed
}

export async function getFamilyAltarList(payloads: FamilyAltarListPayload): Promise<any> {
  // const payload: payloads;
  // FamilyAltarListPayload = {
  //   filter: {
  //     set_guid: false,
  //     guid: "1e0be8f1-5495-4b33-a827-7d0c9470179a",
  //     set_kode_fa: false,
  //     kode_fa: "0101",
  //     set_nama_fa: false,
  //     nama_fa: "rejo",
  //     set_area_id: false,
  //     area_id: "eea35686-cd0a-40af-a865-8a1f247cc7a6",
  //     set_area_name: false,
  //     area_name: "timur",
  //     set_hari_fa: false,
  //     hari_fa: "selasa",
  //     set_fa_wilayah_id: false,
  //     fa_wilayah_id: '',
  //     set_kode_wilayah: false,
  //     kode_wilayah: '',
  //     set_fa_sektor_id: false,
  //     fa_sektor_id: '',
  //     set_kode_sektor: false,
  //     kode_sektor: '',
  //   },
  //   limit: 10,
  //   page: 1,
  //   order: "created_at",
  //   sort: "DESC"
  // };

  try {
    const response: FamilyAltarListResponse = await api.post("/family-altar/list", payloads);
    return response;
  } catch (error) {
    console.error("Failed to fetch family altar list:", error);
    return [];
  }
}
