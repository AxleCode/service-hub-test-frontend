import { api } from "@/lib/api-client";

interface Filter {
  set_guid: boolean;
  guid: string;
  set_wp_id: boolean;
  wp_id: number;
  set_category_event: boolean;
  category_event: string;
  set_title: boolean;
  title: string;
  set_status: boolean;
  status: string;
  set_created_time: boolean;
  created_time_start: string;
  created_time_end: string;
}

interface Payload {
  filter: Filter;
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export async function getEventList(payload: Payload) {
  try {
    const response = await api.post("/event-api/list", payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
