import { api } from "@/lib/api-client";
import { JamaahAttendanceResponse } from "@/types/master-data/jamaah-attendance";

export interface JamaahAttendanceListFilter {
  set_guid: boolean;
  guid: string;
  set_fullname: boolean;
  fullname: string;
  set_jamaah_id: boolean;
  jamaah_id: string;
  set_check_in_date: boolean;
  check_in_date: string;
  set_check_in_time_range: boolean;
  check_in_time_start: string;
  check_in_time_end: string;
}

export interface GetJamaahAttendanceListPayload {
  filter: JamaahAttendanceListFilter;
  limit: number;
  page: number;
  order: string;
  sort: "ASC" | "DESC";
}

export const getJamaahAttendanceList = (payload: GetJamaahAttendanceListPayload) => {
  return api.post<JamaahAttendanceResponse>(
    "/attendance/list",
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};
