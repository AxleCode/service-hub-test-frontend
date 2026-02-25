export interface HasAccess {
  is_create: boolean;
  is_read: boolean;
  is_update: boolean;
  is_delete: boolean;
  is_custom_1: boolean;
  is_custom_2: boolean;
  is_custom_3: boolean;
}

export interface SideMenu {
  id: string;
  text: string;
  icon: string;
  url_path: string;
  code: string;
  has_page: boolean;
  slug: string;
  level: number;
  status: string;
  parent_menu_id: string;
  order_number: number;
  has_access: HasAccess;
  sub_menu: SideMenu[] | null;
}

export interface SideMenuMessage {
  id: string;
  en: string;
}

export interface SideMenuResponse {
  data: SideMenu[];
  message: SideMenuMessage;
}
