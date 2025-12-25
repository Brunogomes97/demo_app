import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  name: string;
  list: { title: string; value: string | null }[];
  filterKey: string; // Adicione uma chave para identificar o filtro
  className?: string;
}

export default function FilterButton({
  list,
  name,
  filterKey,
  className,
}: FilterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    searchParams.get(filterKey) || null
  );

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );
  useEffect(() => {
    const newQuery = createQueryString({ [filterKey]: selectedFilter });
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  }, [selectedFilter, filterKey, pathname, createQueryString, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={selectedFilter ? "default" : "outline"}
          size="sm"
          className={cn("h-7 gap-1 text-sm", className)}
        >
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">
            {selectedFilter
              ? list.find((item) => item.value === selectedFilter)?.title
              : name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {list.map((item, index) => (
          <React.Fragment key={Math.random()}>
            <DropdownMenuCheckboxItem
              key={index}
              checked={selectedFilter === item.value}
              onCheckedChange={() => setSelectedFilter(item.value)}
            >
              {item.title}
            </DropdownMenuCheckboxItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
