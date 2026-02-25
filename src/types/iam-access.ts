export interface SiePelayanan {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Divisi {
  id: string;
  name: string;
}

export interface HasAccessDropdown {
  divisi: boolean;
  department: boolean;
  sie_pelayanan: boolean;
  scanner: boolean;
}

export interface IamAccessData {
  guid: string;
  sie_pelayanan_id: SiePelayanan;
  department_id: Department;
  divisi_id: Divisi;
  menu_access: any | null;
  has_access_dropdown: HasAccessDropdown;
  created_at: string; // ISO date string
  created_by: string;
  updated_at: string | null; // ISO date string or null
  updated_by: string;
}

export interface IamAccessResponse {
  data: IamAccessData[];
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
}
