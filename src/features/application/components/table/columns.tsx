import { ColumnDef } from "@tanstack/react-table";
import { Application } from "../../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IndexTableCell } from "@/components/index-table-cell";
import { DataTableActions } from "./data-table-actions";

export const columns: ColumnDef<Application>[] = [
  {
    id: "no",
    header: "No",
    meta: {
      customClassName: "w-12 text-center",
    },
    cell: (context) => <IndexTableCell context={context} />,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Client ID",
    accessorKey: "client_id",
  },
  {
    id: "status",
    header: "Status",
    meta: {
      customClassName: "w-48 text-center",
    },
    cell: ({ row }) => {
      const status = row.original.is_active ? "Active" : "Inactive";
      return (
        <Badge
          variant="outline"
          className={cn({
            "border-green-500 text-green-500": row.original.is_active,
            "border-red-500 text-red-500": !row.original.is_active,
          })}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: {
      customClassName: "w-24 text-center",
    },
    cell: ({ row }) => <DataTableActions data={row.original} />,
  },
];
