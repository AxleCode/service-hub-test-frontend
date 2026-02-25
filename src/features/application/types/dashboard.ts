export interface Course {
  categoryid: number;
  categorysortorder: number;
  completionnotify: number;
  courseformatoptions: Array<{
    name: string;
    value: number;
  }>;
  defaultgroupingid: number;
  displayname: string;
  enablecompletion: number;
  enddate: number;
  forcetheme: string;
  format: string;
  fullname: string;
  groupmode: number;
  groupmodeforce: number;
  hiddensections: number;
  id: number;
  idnumber: string;
  lang: string;
  maxbytes: number;
  newsitems: number;
  numsections: number;
  shortname: string;
  showactivitydates: boolean;
  showcompletionconditions: boolean;
  showgrades: number;
  showreports: number;
  startdate: number;
  summary: string;
  summaryformat: number;
  timecreated: number;
  timemodified: number;
  visible: number;
}

export interface DashboardData {
  guid: string;
  area_id: string;
  divisi_id: string;
  department_id: string;
  sie_pelayanan_id: string;
  fullname: string;
  email: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  address: string;
  profile_picture: string | null;
  status: string;
  is_baptist: boolean;
  is_fa: boolean;
  is_pelayanan: boolean;
  jumlah_absen_ibadah: number;
  target_absen_ibadah: number;
  persentase_absen_ibadah: number;
  jumlah_absen_family_altar: number;
  target_absen_family_altar: number;
  persentase_absen_family_altar: number;
  list_course: Course[];
}

export interface DashboardResponse {
  data: DashboardData;
  message: {
    id: string;
    en: string;
  };
}

