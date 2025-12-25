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
import LoadingWrapper from "@/components/loading-wrapper";
export type Items = {
  name: string;
  id: string;
};

export type DataItems = {
  items: Items[];
  title: string;
  className?: string;
  onChange: (value: string) => void;
  value: string | undefined;
  loading?: boolean;
};

const SelectItemsByID = React.forwardRef(
  (
    { items, title, className = "", onChange, value, loading = false, ...props }: DataItems,
    // ref,
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
        <SelectContent>
          <LoadingWrapper variant="clip-loader" isLoading={loading}>
            <SelectGroup>
              <SelectLabel>{title}</SelectLabel>
              {items.map((item, i) => (
                <SelectItem key={i} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </LoadingWrapper>
        </SelectContent>
      </Select>
    );
  },
);

SelectItemsByID.displayName = "SelectItems";

export { SelectItemsByID };
