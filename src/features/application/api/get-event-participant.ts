import { api } from "@/lib/api-client";

interface Filter {
  set_guid: boolean;
  guid: string;
  set_event_id: boolean;
  event_id: string;
  set_event_name: boolean;
  event_name: string;
  set_participant_name: boolean;
  participant_name: string;
  set_participant_email: boolean;
  participant_email: string;
  set_participant_phone: boolean;
  participant_phone: string;
  set_participant_gender: boolean;
  participant_gender: string;
  participant_address: string;
}

interface Payload {
  filter: Filter;
  limit: number;
  page: number;
  order: string;
  sort: string;
}

export async function getEventParticipant(payload: Payload) {
  try {
    const response = await api.post(
      "/event-api/list-participant-detail",
      payload,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}
