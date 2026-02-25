import { CellContext, RowData } from "@tanstack/react-table";

interface Props<TData extends RowData, TValue = unknown> {
  context: CellContext<TData, TValue>;
}

export const IndexTableCell = <TData extends RowData, TValue = unknown>({
  context,
}: Props<TData, TValue>) => {
  const { row, table } = context;
  const { pageIndex, pageSize } = table.getState().pagination;
  const index = pageIndex * pageSize + row.index + 1;
  return <div>{index}</div>;
};
