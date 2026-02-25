import { api } from "@/lib/api-client";

export interface AttendancePerformanceItem {
  guid: string;
  jamaah_id: string;
  fullname: string;
  check_in_date: string;
  check_in_time: string;
  jumlah_absen: number;
  target_absen: number;
  persentase_absen: number;
}

export interface AttendancePerformanceResponse {
  data: AttendancePerformanceItem[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
}

export interface AttendancePerformanceFilter {
  set_guid: boolean;
  set_fullname: boolean;
  fullname?: string;
  set_jamaah_id: boolean;
  jamaah_id?: string;
  set_check_in_date: boolean;
  check_in_date?: string;
  set_check_in_time_range: boolean;
  check_in_time_start?: string;
  check_in_time_end?: string;
}

export interface GetAttendanceByPerformancePayload {
  filter: AttendancePerformanceFilter;
  limit: number;
  page: number;
  order: string;
  sort: "ASC" | "DESC";
}

export const getAttendanceByPerformance = (payload: GetAttendanceByPerformancePayload) => {
  return api.post<AttendancePerformanceResponse>(
    "/attendance/attendance-by-performance",
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

