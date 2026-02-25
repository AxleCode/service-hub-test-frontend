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

/** Response format dari API check-weather/info (location + current weather) */
export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph?: number;
  gust_kph?: number;
}

export interface WeatherDashboardData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

export interface WeatherDashboardResponse {
  data: WeatherDashboardData;
  message: {
    id: string;
    en: string;
  };
}

