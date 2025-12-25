import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/app/(pages)/dashboard/types";

interface ShowNoteDialogProps {
  data: Product | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dateFormat = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));

export default function ShowNoteDialog({
  open,
  setOpen,
  data,
}: Readonly<ShowNoteDialogProps>) {
  if (!data) return <></>;

  const formattedData = {
    title: data.name,
    category: data.category,
    createdAt: dateFormat(data.createdAt),
    description: data.description,
    price: Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(data.price),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] min-h-42">
        <DialogHeader>
          <DialogTitle>{formattedData.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 select-none">
          <div className="select-none flex flex-col gap-1">
            <span className="text-sm text-muted-foreground cursor-pointer">
              Categoria
            </span>
            <span className="text-sm font-medium leading-none">
              <Badge>{formattedData.category}</Badge>
            </span>
          </div>
          <div className="select-none flex flex-col gap-1 ">
            <span className="text-sm text-muted-foreground cursor-pointer">
              Data
            </span>
            <span className="text-base font-medium leading-none">
              {formattedData.createdAt}
            </span>
          </div>
          <div className="select-none flex flex-col gap-1">
            <span className="text-sm text-muted-foreground cursor-pointer">
              Valor
            </span>
            <div className="text-base font-medium leading-none">
              {formattedData.price}
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground cursor-pointer">
          Descrição
        </span>
        <div className="flex flex-col gap-1">
          <ContentList description={formattedData?.description || ""} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ContentProps {
  description: string;
}

function ContentList({ description }: ContentProps) {
  return (
    <div
      className="border rounded-sm px-2 py-3
       break-words break-all hyphens-auto"
    >
      {description}
    </div>
  );
}
