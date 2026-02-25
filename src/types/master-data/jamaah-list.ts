/// Request
export type FilterRequestListJamaahMasterData = {
  filter: {
    set_guid: boolean;
    guid: string;
    set_divisi_id: boolean;
    divisi_id: string;
    set_divisi_name: boolean;
    divisi_name: string;
    set_area_id: boolean;
    area_id: string;
    set_area_name: boolean;
    area_name: string;
    set_department_id: boolean;
    department_id: string;
    set_department_name: boolean;
    department_name: string;
    set_sie_pelayanan_id: boolean;
    sie_pelayanan_id: string;
    set_sie_pelayanan_name: boolean;
    sie_pelayanan_name: string;
    set_fullname: boolean;
    fullname: string;
    set_email: boolean;
    email: string;
    set_phone_number: boolean;
    phone_number: string;
    set_gender: boolean;
    gender: string;
    set_date_of_birth: boolean;
    date_of_birth: string;
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
};


/// Response 

export type JamaahProfilePicture = {
  url: string;
  filename: string;
} | null;

export type JamaahListItem = {
  guid: string;
  divisi_id: string;
  nama_divisi: string;
  area_id: string;
  area_wilayah: string;
  department_id: string | null;
  nama_department: string | null;
  sie_pelayanan_id: string | null;
  seksi_pelayanan: string | null;
  jamaah_fullname: string;
  jamaah_email: string;
  jamaah_phone_number: string;
  gender: string;
  date_of_birth: string;
  is_baptist: boolean;
  status: string;
  address: string | null;
  profile_picture: JamaahProfilePicture;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
};

export type JamaahListResponse = {
  data: JamaahListItem[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
};