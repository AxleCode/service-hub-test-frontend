import { api } from "@/lib/api-client";

export interface AttendanceTargetThresholdListFilter {
  set_guid: boolean;
  guid: string;
  set_category: boolean;
  category: string;
}

export interface PostAttendanceTargetThresholdListPayload {
  filter: AttendanceTargetThresholdListFilter;
  limit: number;
  page: number;
  order: string;
  sort: "ASC" | "DESC";
}

export interface CreateAttendanceTargetThresholdPayload {
  category: "Family Altar" | "Ibadah";
  target_attendance: number;
}

export const postAttendanceTargetThresholdList = (payload: any) => {
  return api.post(
    "/attendance-target-threshold/list",
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const createAttendanceTargetThreshold = (payload: CreateAttendanceTargetThresholdPayload) => {
  return api.post(
    "/attendance-target-threshold",
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteAttendanceTargetThreshold = (id: string) => {
  return api.delete(
    `/attendance-target-threshold/${id}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

export const updateAttendanceTargetThreshold = (
  id: string,
  payload: CreateAttendanceTargetThresholdPayload
) => {
  return api.put(
    `/attendance-target-threshold/${id}`,
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};
