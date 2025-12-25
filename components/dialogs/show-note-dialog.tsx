import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { NotesColumnData } from "@/app/(pages)/dashboard/types";
import { noteTypeObjectFormatReverse } from "../constants/data";

interface ShowNoteDialogProps {
  callback?: () => void;
  data: NotesColumnData | null;
  className?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dateFormat = (date: string) => new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}).format(new Date(date))



export default function ShowNoteDialog({
  open,
  setOpen,
  data,
}: ShowNoteDialogProps) {

  if (!data) return <></>;

  const noteData = {
    title: data.title,
    createdAt: dateFormat(data.createdAt),
    type: noteTypeObjectFormatReverse[data.type],
    description: data.description
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] min-h-42">
        <DialogHeader>
          <DialogTitle>{noteData.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 select-none">
          <div className="select-none flex flex-col gap-1">
            <span className="text-sm text-muted-foreground cursor-pointer">
              Tipo
            </span>
            <span className="text-sm font-medium leading-none">
              <Badge>
                {noteData.type}
              </Badge>
            </span>
          </div>
          <div className="select-none flex flex-col gap-1 ">
            <span className="text-sm text-muted-foreground cursor-pointer">
              Data
            </span>
            <span className="text-base font-medium leading-none">
              {noteData.createdAt}
            </span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground cursor-pointer">
          Descrição
        </span>
        <div className="flex flex-col gap-1">
          <ContentList data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ContentProps {
  data: NotesColumnData;
}


function ContentList({ data }: ContentProps) {
  return (
    <>
      <div className="border rounded-sm px-2 py-3
       break-words break-all hyphens-auto">
        {data.description}
      </div>
    </>
  )
}


