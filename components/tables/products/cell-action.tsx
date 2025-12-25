"use client";
import { removeProduct } from "@/app/(pages)/dashboard/actions";
import { Product } from "@/app/(pages)/dashboard/types";
import { EditNoteDialog } from "@/components/dialogs/edit-note-dialog";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const onConfirm = async () => {
    try {
      await removeProduct(data.id);
      toast({
        variant: "success",
        title: "Sucesso.",
        description: "Produto Removido!",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao remover o produto.",
      });
    }

    setRemoveOpen(false);
  };
  return (
    <>
      <AlertModal
        title={`Remover Produto [${data.name}]`}
        description={`Esta ação é destrutiva e não poderá ser desfeita. Confirme se deseja prosseguir.`}
        confirmVariant="destructive"
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <EditNoteDialog data={data} state={[editOpen, setEditOpen]} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setRemoveOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
