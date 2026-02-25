import { BaseResponse } from "@/types/base";

export type Application = {
  guid?: string;
  client_id?: string;
  name?: string;
  redirect_uri?: string;
  is_active?: boolean;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
};

export type ApplicationListResponse = BaseResponse<Array<Application>>;
