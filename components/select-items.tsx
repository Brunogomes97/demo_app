import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingWrapper from "./loading-wrapper";
export type DataItems = {
  items: string[];
  title: string;
  className?: string;
  onChange: (value: string) => void;
  value: string;
  loading?: boolean;
};

const SelectItems = React.forwardRef<HTMLDivElement, DataItems>(
  (
    { items, title, className = "", onChange, value, loading = false, ...props },
    ref,
  ) => {
    return (
      <Select
        {...props}
        onValueChange={onChange}
        value={value}
        defaultValue={value}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Selecione um item" />
        </SelectTrigger>
        <SelectContent ref={ref}>
          <SelectGroup>
            <LoadingWrapper variant="clip-loader" isLoading={loading}>
              <SelectLabel>{title}</SelectLabel>
              {items.map((item, i) => (
                <SelectItem key={i} value={item}>
                  {item}
                </SelectItem>
              ))}
            </LoadingWrapper>
          </SelectGroup>

        </SelectContent>
      </Select>

    );
  },
);

SelectItems.displayName = "SelectItems";

export { SelectItems };
