// "use client";

// import { DataTable } from "./table/data-table";
// import { columns } from "./table/columns";
// import { useApplications } from "../api/get-application";
// import { useMemo } from "react";
// import { PrimaryButtons } from "./table/primary-buttons";

// export const ApplicationList = () => {
//   const { data: applications } = useApplications({
//     request: {
//       filter: {
//         set_client_guid: false,
//         param_client_guid: "3f3e8bc0-de59-4c16-82d4-a22ddd390df5",
//         set_client_name: false,
//         param_client_name: "myapp",
//         set_status: false,
//         param_status: false,
//       },
//       limit: 10,
//       page: 1,
//       order: "created_at",
//       sort: "DESC",
//     },
//   });

//   const data = useMemo(() => {
//     return applications?.response?.data || [];
//   }, [applications]);

//   return (
//     <div>
//       <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
//         </div>
//         <PrimaryButtons />
//       </div>
//       <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
//         <DataTable
//           columns={columns}
//           data={data || []}
//           totalItems={applications?.response?.total_data || 0}
//         />
//       </div>
//     </div>
//   );
// };
