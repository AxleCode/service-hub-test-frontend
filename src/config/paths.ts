export const paths = {
  home: {
    path: "/",
    getHref: (redirectTo?: string) =>
      `/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  register: {
    path: "/register",
    getHref: () => "/register",
  },
  dashboard: {
    root: {
      path: "/dashboard",
      getHref: () => "/dashboard",
    },
    application: {
      path: "/dashboard/application",
      getHref: () => "/dashboard/application",
    },
  },
};
