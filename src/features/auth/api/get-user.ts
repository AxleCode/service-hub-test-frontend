import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { PROFILE_KEYS } from "./keys";
import { AuthUser } from "@/types/auth";

export const getUsers = (): Promise<AuthUser> =>
  api.get(`${services.auth}/endpoint`);

export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: PROFILE_KEYS.list({}),
    queryFn: () => getUsers(),
  });
type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) =>
  useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
