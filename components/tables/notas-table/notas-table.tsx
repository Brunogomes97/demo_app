"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnsOptions } from "@/components/tables/column-selector";
import FilterButton from "@/components/buttons/filter-button";
import { NotesColumnData } from "@/app/(pages)/dashboard/types";
import ShowNoteDialog from "@/components/dialogs/show-note-dialog";
import { RemoveButton } from "@/components/buttons/remove-button";
import { AlertModal } from "@/components/modal/alert-modal";
import { Badge } from "@/components/ui/badge";
import { removeManyNotes } from "@/app/(pages)/dashboard/actions";
import { noteTypeObjectFormatReverse } from "@/components/constants/data";
import { toast } from "@/hooks/use-toast";
import { ApiErrorProps } from "@/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pageNo: number;
  totalItems: number;
  pageSizeOptions?: number[];
  pageCount: number;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
  tableName?: string;
}

export function NotesTable<TData, TValue>({
  columns,
  data = [],
  searchKey = "",
  // pageNo = 1,
  // totalItems = 0,
  pageCount = 1,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  tableName = "Espécie",
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Search params
  const page = searchParams?.get("page") ?? "1";
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get("limit") ?? "5";
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 5 : perPageAsNumber;

  const typeOptions = [
    { title: "Todos", value: null },
    { title: "Pessoal", value: "personal" },
    { title: "Trabalho", value: "work" },
    { title: "Estudo", value: "study" },
    { title: "Ideia", value: "ideia" },
    { title: "Lembrete", value: "reminder" },
    { title: "Para fazer", value: "todo" },
    { title: "Meeting", value: "meeting" }
  ];

  const optionsList = {
    type: typeOptions,
    order: [{ title: "Mais antigo", value: "asc" }, { title: "Mais recente", value: null }],
  };
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<NotesColumnData | null>(
    null,
  );
  const [removeManyOpen, setRemoveAllOpen] = useState(false);


  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); 

  */




  // Create query string
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
    [searchParams],
  );

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    });

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
      })}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  const searchValue = table.getColumn(searchKey)?.getFilterValue() as string;

  React.useEffect(() => {
    if (searchValue?.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: searchValue,
        })}`,
        {
          scroll: false,
        },
      );
    }
    if (searchValue?.length === 0 || searchValue === undefined) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: null,
        })}`,
        {
          scroll: false,
        },
      );
    }

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  const selectedRows = table.getFilteredSelectedRowModel();
  const selectedItems = selectedRows.rows.map((row) => row.original) as NotesColumnData[];

  const RemoveManyContent = () => {
    return (
      <>
        <div className="text-sm border rounded-md p-2">
          <div className="grid grid-cols-3 text-muted-foreground gap-4 mb-2">
            <span>Título</span>
            <span>Tipo</span>
            <span>Data</span>
          </div>
          <div className="grid grid-cols-3 overflow-y-auto max-h-40 gap-4">
            {selectedItems.map((item) => (
              <React.Fragment key={item.id}>
                <span>{item.title}</span>
                <Badge variant={"secondary"} className="h-fit w-fit">
                  {noteTypeObjectFormatReverse[item.type]}
                </Badge>
                <span>{new Intl.DateTimeFormat("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(item.createdAt))}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </>
    )
  }

  const handleRemoveItems = async () => {
    try {
      await removeManyNotes(selectedItems.map((item) => item.id))
      toast({
        variant: "success",
        title: "Sucesso.",
        description: "Notas removidas com sucesso!",
      })

    } catch (error: unknown) {
      const err = error as ApiErrorProps;
      toast({
        variant: "destructive",
        title: "Erro.",
        description: "Ocorreu um erro ao remover as notas!",
      })
      console.log(err);

    } finally {
      setRemoveAllOpen(false)
      table.toggleAllPageRowsSelected(false)
    }
  }


  return (
    <>
      <ShowNoteDialog data={selectedRow} open={open} setOpen={setOpen} />
      <AlertModal
        title={`Deseja remover as notas selecionadas?`}
        description={`Esta ação é destrutiva e não poderá ser desfeita. Confirme se deseja prosseguir.`}
        confirmVariant="destructive"
        isOpen={removeManyOpen}
        onClose={() => setRemoveAllOpen(false)}
        onConfirm={handleRemoveItems}
        loading={false}
        content={<RemoveManyContent />}
      />
      <div className="flex items-center">
        <Input
          placeholder={`${"Título da"} ${tableName}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
        <FilterButton name="Tipos" filterKey="type" list={optionsList.type} className="mx-2" />
        <FilterButton name="Ordenação" filterKey="order" list={optionsList.order} className="mx-2" />
        <RemoveButton className="mr-2" disabled={selectedItems.length === 0} items={selectedItems} onClick={() => setRemoveAllOpen(true)} />
        <ColumnsOptions columns={table.getAllColumns()} />
      </div>
      <div className="border rounded-md">

        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      onClick={() => {
                        setOpen(true);
                        setSelectedRow(row.original as NotesColumnData);
                      }}
                      key={cell.id}
                      className="cursor-pointer truncate max-w-[250px] whitespace-nowrap overflow-hidden">

                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Não há itens, clique no botão para adicionar um ao seu
                  sistema.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-2 rounded-md border sticky bottom-3 bg-background  flex flex-col gap-2 sm:flex-row items-center justify-end space-x-2 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                itens por página
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
