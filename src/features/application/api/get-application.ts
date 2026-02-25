// import { queryOptions, useQuery } from "@tanstack/react-query";

// import { services } from "@/config/constants";
// import { api } from "@/lib/api-client";
// import { QueryConfig } from "@/lib/react-query";
// import { BaseListRequest } from "@/types/base";

// import { APPLICATION_KEYS } from "./keys";
// import { ApplicationListResponse } from "../types";

// export type ApplicationParam = {
//   set_client_guid?: boolean;
//   param_client_guid?: string;
//   set_client_name?: boolean;
//   param_client_name?: string;
//   set_status?: boolean;
//   param_status?: boolean;
// };

// export type ApplicationRequest = BaseListRequest<ApplicationParam>;

// export const getApplications = (
//   request: ApplicationRequest
// ): Promise<ApplicationListResponse> =>
//   api.post(`${services.auth}/application/list`, request);

// export const getApplicationsQueryOptions = (
//   request: BaseListRequest<ApplicationParam>
// ) =>
//   queryOptions({
//     queryKey: APPLICATION_KEYS.list({ ...request }),
//     queryFn: () => getApplications(request),
//   });

// type UseApplicationsOptions = {
//   request: ApplicationRequest;
//   queryConfig?: QueryConfig<typeof getApplicationsQueryOptions>;
// };

// export const useApplications = ({
//   request,
//   queryConfig,
// }: UseApplicationsOptions) =>
//   useQuery({
//     ...getApplicationsQueryOptions(request),
//     ...queryConfig,
//   });
