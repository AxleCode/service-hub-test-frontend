export const DataTableShowing = ({
  totalItems,
  currentPage,
  pageSize,
}: {
  totalItems: number;
  currentPage: number;
  pageSize: number;
}) => {
  const page = currentPage - 1;
  const exactLastItem = page * pageSize + pageSize;
  const realLastItem = exactLastItem > totalItems ? totalItems : exactLastItem;
  return (
    <div className="text-sm text-muted-foreground">
      Showing {page * pageSize + 1} - {realLastItem} of {totalItems} items
    </div>
  );
};
