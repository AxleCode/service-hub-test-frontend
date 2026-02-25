export interface JamaahAttendance {
  guid: string;
  jamaah_id: string;
  fullname: string;
  check_in_date: string; // e.g. "2025-07-22"
  check_in_time: string; // ISO string, e.g. "2025-07-22T18:23:08.11079Z"
  qr_code_string: string;
  status: string;
  created_at: string; // ISO string
  created_by: string;
  updated_at: string; // ISO string
  updated_by: string;
}

export interface JamaahAttendanceMessage {
  id: string;
  en: string;
}

export interface JamaahAttendanceResponse {
  data: JamaahAttendance[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: JamaahAttendanceMessage;
}
