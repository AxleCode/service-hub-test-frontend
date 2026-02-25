/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Application } from "@/features/application/types";
import { Pencil, Trash } from "lucide-react";

export const DataTableActions = ({ data }: { data: Application }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button variant="outline" size="icon">
        <Pencil className="size-4" />
      </Button>
      <Button variant="outline" size="icon" className="text-red-400">
        <Trash className="size-4" />
      </Button>
    </div>
  );
};
