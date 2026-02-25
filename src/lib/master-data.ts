import { api } from "./api-client";

import { FilterRequestListJamaahMasterData, JamaahListResponse } from "@/types/master-data/jamaah-list";



export const listJamaahMasterData = (data: FilterRequestListJamaahMasterData) => {
  const body = data;
  return api.post<JamaahListResponse>(
    `/jamaah/list`,
    body,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const listMasterdataValue = (category: string, setCategory: boolean) => {
  const body = {
    filter: {
      set_reference_id: false,
      reference_id: 1,
      set_category: setCategory,
      category: category,
      set_value: false,
      value: "sta"
    },
    limit: 100000,
    page: 1,
    order: "created_at",
    sort: "DESC"
  };
  return api.post<unknown>(
    `/masterdata_value/list`,
    body,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

// // refresh token
// export const refreshToken = () => {
//   const token = getCookie(auth.refresh_token);

//   return apiToken.get<BaseResponse<GenerateToken>>(
//     `/token/refresh`,
//     {
//       headers: {
//         "refresh-token": token,
//       },
//     }
//   );
// };
