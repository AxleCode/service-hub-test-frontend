import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";


function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalData,
  currentDataCount,
  currentDataStart,
  currentDataEnd,
  className,
  ...props
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalData?: number;
  currentDataCount?: number;
  currentDataStart?: number;
  currentDataEnd?: number;
} & React.ComponentProps<"nav">) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
            href="#"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };


  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex items-center space-x-1 py-3", className)}
      {...props}
    >
      {totalData !== undefined && (
        <div className="ml-2 text-sm text-gray-700 dark:text-gray-300 select-none">
          {currentDataStart !== undefined && currentDataEnd !== undefined
            ? `Showing ${currentDataStart} to ${currentDataEnd} of ${totalData} entries`
            : currentDataCount !== undefined
            ? `Showing ${currentDataCount} of ${totalData} entries`
            : `Total: ${totalData} entries`}
        </div>
      )}

      <div className="flex-1 flex justify-center">
        {currentPage > 1 && (
          <PaginationPrevious
            onClick={handlePrevious}
            href="#"
            className="bg-white border border-gray-300 shadow-sm hover:bg-gray-100 rounded-md transition-colors dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
          />
        )}
        <PaginationContent className="space-x-2">{renderPageNumbers()}</PaginationContent>
        {currentPage < totalPages && (
          <PaginationNext
            onClick={handleNext}
            href="#"
            className="bg-white border border-gray-300 shadow-sm hover:bg-gray-100 rounded-md transition-colors dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
          />
        )}
      </div>
    </nav>
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
