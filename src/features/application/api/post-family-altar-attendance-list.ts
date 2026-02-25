import { api } from "@/lib/api-client";

export interface FamilyAltarAttendanceListFilter {
  set_emp_guid: boolean;
  emp_guid: string;
  set_emp_nama: boolean;
  emp_nama: string;
  set_emp_email: boolean;
  emp_email: string;
  set_emp_phone: boolean;
  emp_phone: string;
  set_fa_guid: boolean;
  fa_guid: string;
  set_fa_kode: boolean;
  fa_kode: string;
  set_fa_nama: boolean;
  fa_nama: string;
  set_check_in_time: boolean;
  check_in_time_start: string;
  check_in_time_end: string;
}

export interface PostFamilyAltarAttendanceListPayload {
  filter: FamilyAltarAttendanceListFilter;
  limit: number;
  page: number;
  order: string;
  sort: "ASC" | "DESC";
}

export const postFamilyAltarAttendanceList = (payload: any) => {
  return api.post(
    "/family-altar-attendance/list",
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};
