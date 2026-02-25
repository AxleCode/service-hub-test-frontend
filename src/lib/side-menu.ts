import { api } from "./api-client";

import { SideMenuResponse } from "@/types/configuration/side-menu/side-menu";



export const menu = () => {
  // const body = data;
  return api.get<SideMenuResponse>(
    `/menu/`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};

import { SideMenu } from "@/types/configuration/side-menu/side-menu";

export const updateMenu = (id: string, data: Partial<SideMenu>) => {
  return api.put(`/menu/${id}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const updateMenuStatus = (id: string, status: string) => {
  return api.put(`/menu/status/${id}`, { status }, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const deleteMenu = (id: string) => {
  return api.delete(`/menu/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
