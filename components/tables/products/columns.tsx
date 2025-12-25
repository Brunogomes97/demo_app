"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Product } from "@/app/(pages)/dashboard/types";
import { DateTime } from "luxon";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const type = row.original.category.toUpperCase();
      const types: { [key: string]: string } = {
        electronics: "Eletrônicos",
        furniture: "Móveis",
        clothing: "Roupas",
        books: "Livros",
        toys: "Brinquedos",
        food: "Alimentos",
        other: "Outros",
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
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      return (
        <div>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.original.price)}
        </div>
      );
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
