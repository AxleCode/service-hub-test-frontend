import { api } from "@/lib/api-client";

interface Filter {
  set_guid: boolean;
  guid: string;
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
  set_wilayah_id: boolean;
  wilayah_id: string;
  set_kode_wilayah: boolean;
  kode_wilayah: string;
  set_ketua_wilayah: boolean;
  nama_ketua_wilayah: string;
  set_sektor_id: boolean;
  sektor_id: string;
  set_kode_sektor: boolean;
  kode_sektor: string;
  set_ketua_sektor: boolean;
  nama_ketua_sektor: string;
  set_pengurus_id: boolean;
  pengurus_id: string;
  set_jabatan_anggota: boolean;
  jabatan_anggota: string;
}

interface Payload {
  filter: Filter;
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export async function getFamilyAltarAnggotaList(payload: Payload) {
  try {
    const response = await api.post("/family-altar-anggota/list", payload, {
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
