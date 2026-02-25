/// Request
export type FilterRequestListEventData = {
  filter: {
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
  };
  limit: number;
  page: number;
  order: string;
  sort: string;
};

/// Response

export type EventListItem = {
  guid: string | null;
  wp_id: number | null;
  wp_created_time: string | null;
  title: string | null;
  slug: string | null;
  link: string | null;
  category_event: string | null;
  image_banner: string | null;
  image_thumbnail: string | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
  wp_status: string | null;
  status: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
};

export type EventListResponse = {
  data: EventListItem[];
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  message: {
    id: string;
    en: string;
  };
};
