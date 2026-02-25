export type BaseResponse<T> = {
  data: T;
  message: DeviceLoginMessage;
};

export type DeviceLoginData = {
  name: string;
  device_id: string;
  device_type: string;
  token: string;
  token_expired: string;
  refresh_token: string;
  refresh_token_expired: string;
  is_login: boolean;
  user_login: string;
};

export type DeviceLoginMessage = {
  id: string;
  en: string;
};

export type BaseListRequest<T> = {
  filter?: T;
  limit?: number;
  page?: number;
  order?: string;
  sort?: string;
};