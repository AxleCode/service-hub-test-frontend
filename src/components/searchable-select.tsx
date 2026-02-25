"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Button,
} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SearchableSelect({ jabatanList, value, onChangeAction }: {
  jabatanList: { id: string; value: string }[];
  value: string;
  onChangeAction: (val: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selectedItem = jabatanList.find((item) => item.id === value);

  const filteredList = query === ""
    ? jabatanList
    : jabatanList.filter((item) =>
        item.value.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem ? selectedItem.value : "Select Pengurus"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search pengurus..."
            value={query}
            onValueChange={(text) => setQuery(text)}
          />
          <CommandEmpty>No pengurus found.</CommandEmpty>
          <CommandGroup>
            {filteredList.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => {
                  onChangeAction(item.id);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    item.id === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
