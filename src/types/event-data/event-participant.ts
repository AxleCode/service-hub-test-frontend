/// Request
// src/types/event-data/event-participant.ts
export type FilterRequestListEventParticipant = {
  filter: {
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
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
};

export type QRCollectionItem = {
  guid: string | null;
  qr_code_string: string | null;
  is_email_sent: boolean;
  is_claimed: boolean;
};

export type EventParticipantListItem = {
  set_guid: string | null;
  guid: string | null;
  set_event_id: string | null;
  event_id: string | null;
  set_event_name: string | null;
  event_name: string | null;
  set_participant_name: string | null;
  participant_name: string | null;
  set_participant_email: string | null;
  participant_email: string | null;
  set_participant_phone: string | null;
  participant_phone: string | null;
  set_participant_gender: string | null;
  participant_gender: string | null;
  participant_address: string | null;
  status: string | null;
  qr_collection?: QRCollectionItem[];
};

export type EventListResponse = {
  data: EventParticipantListItem[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
};