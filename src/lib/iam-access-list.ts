import { api } from "@/lib/api-client";

export interface IamAccessListRequest {
  filter: {
    set_position_id: boolean;
    position_id: string;
    set_job_level_id: boolean;
    job_level_id: string;
    set_department_id: boolean;
    department_id: string;
    set_property_id: boolean;
    property_id: string;
    set_brand_id: boolean;
    brand_id: string;
    set_group_id: boolean;
    group_id: string;
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export interface IamAccessListResponse {
  data: {
    guid: string;
    sie_pelayanan_id: {
      id: string;
      name: string;
    };
    department_id: {
      id: string;
      name: string;
    };
    divisi_id: {
      id: string;
      name: string;
    };
    menu_access: any | null;
    has_access_dropdown: {
      divisi: boolean;
      department: boolean;
      sie_pelayanan: boolean;
      scanner: boolean;
    };
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string;
  }[];
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
}

export const postIamAccessList = (body: IamAccessListRequest) => {
  return api.post<IamAccessListResponse>(
    "/iam-access/list",
    body,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};


export const getIamAccess = () => {
  return api.get(
    "/auth/iam-access",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const getIamAccessByGuid = (guid: string) => {
  return api.get(
    `/iam-access/${guid}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const putIamAccess = (guid: string, data: any) => {
  return api.put(
    `/iam-access/${guid}`,
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const postIamAccess = (data: any) => {
  return api.post(
    "/iam-access",
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteIamAccess = (guid: string) => {
  return api.delete(
    `/iam-access/${guid}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};
