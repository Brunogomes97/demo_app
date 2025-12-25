"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { NotesColumnData } from "@/app/(pages)/dashboard/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTime } from "luxon";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<NotesColumnData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.type.toLowerCase();
      const types: { [key: string]: string } = {
        personal: "Pessoal",
        work: "Trabalho",
        study: "Estudo",
        ideia: "Ideia",
        reminder: "Lembrete",
        todo: "Para Fazer",
        meeting: "Meeting",
      };
      return <Badge>{types[type] || type}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Data de Criação",
    cell: (props) => {
      const date = DateTime.fromISO(props.row.original.createdAt);
      return date.setLocale("pt-BR").toLocaleString(DateTime.DATETIME_SHORT);
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <div
          className="flex-1 truncate whitespace-nowrap overflow-hidden"
          title={row.original.description}
        >
          {row.original.description}
        </div>
      );
    },
    size: 300, // Define um tamanho inicial, mas permite que a coluna se ajuste
    minSize: 100, // Define um tamanho mínimo para evitar que fique muito pequeno
    enableResizing: true, // Permite redimensionamento dinâmico
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <CellAction data={row.original} />
      </div>
    ),
  },
];
