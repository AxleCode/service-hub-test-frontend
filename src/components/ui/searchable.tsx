"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type Option = {
  label: string;
  value: string;
};

interface AutocompleteProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function Autocomplete({
  options,
  placeholder = "Type to search...",
  onChange,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Filtered options based on typed text
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            setOpen(val.length > 0); // show dropdown only if typing
            onChange?.(val);
          }}
          onFocus={() => {
            if (inputValue.length > 0) setOpen(true);
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {filtered.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  setInputValue(option.label);
                  onChange?.(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
