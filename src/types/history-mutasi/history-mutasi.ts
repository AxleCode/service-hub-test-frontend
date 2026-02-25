/// Request
export type FilterRequestHistoryMutasi = {
  filter: {
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
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
};

/// Response

export type HistoryMutasiListItem = {
  guid: string | null;
  id: number | null;
  family_altar_join_anggota_id: string | null;
  old_fa_id: string | null;
  old_kode_fa: string | null;
  old_nama_fa: string | null;
  old_jamaah_id: string | null;
  old_jamaah_name: string | null;
  old_pengurus_id: string | null;
  old_jabatan_anggota: string | null;
  old_status: string | null;
  new_fa_id: string | null;
  new_kode_fa: string | null;
  new_nama_fa: string | null;
  new_jamaah_id: string | null;
  new_jamaah_name: string | null;
  new_pengurus_id: string | null;
  new_jabatan_anggota: string | null;
  new_status: string | null;
  created_at: string | null;
  created_by: string | null;
};

export type HistoryMutasiListResponse = {
  data: HistoryMutasiListItem[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
};
