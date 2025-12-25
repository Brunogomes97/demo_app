"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction, useState } from "react";
import { SelectItems } from "@/components/select-items";
import { categoryTypes } from "@/components/constants/data";
import { ProductCreateForm, Product } from "@/app/(pages)/dashboard/types";
import { updateProduct } from "@/app/(pages)/dashboard/actions";
import { ApiErrorProps } from "@/lib/types";
import AsyncButton from "@/components/ui/async-button";
import { toast } from "@/hooks/use-toast";

type EditDialogType<T> = {
  state: [T, Dispatch<SetStateAction<T>>];
  data: Product;
};

const zMessage = {
  min: {
    message: "Campo Requerido",
  },
  max: {
    title: "max. 50 caractéres",
    text: "max. 250 caractéres",
  },
};

const formSchema = z.object({
  name: z.string().min(1, zMessage.min).max(50, zMessage.max.title),
  category: z.enum(categoryTypes as [string, ...string[]]),

  price: z.number().min(0, { message: "Preço inválido" }),
  description: z
    .string()
    .min(1, zMessage.min)
    .max(250, { message: zMessage.max.text }),
});
type FormContentType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Product;
};

export function EditNoteDialog({ data, state }: EditDialogType<boolean>) {
  const [open, setOpen] = state;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar dados de {data.name}</DialogTitle>
          <DialogDescription>
            Edite os dados da nota preenchendo os campos abaixo:
          </DialogDescription>
        </DialogHeader>
        <FormContent open={open} setOpen={setOpen} data={data} />
      </DialogContent>
    </Dialog>
  );
}

function FormContent({ setOpen, data }: FormContentType) {
  const [blockConfirm, setBlockConfirm] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      price: data.price,
      category: data.category,
      description: data.description,
    },
  });

  function compareEqual(
    data: ProductCreateForm,
    values: z.infer<typeof formSchema>
  ) {
    const valuesToCompare = {
      title: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
    };

    return JSON.stringify(values) === JSON.stringify(valuesToCompare);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBlockConfirm(true);
    try {
      if (compareEqual(data, values)) {
        toast({
          variant: "destructive",
          title: "Ocorreu um erro ao editar os dados.",
          description: "Altere ao menos 1 campo.",
        });
        return;
      }

      const dataValues = {
        name: values.name,
        category: values.category,
        price: values.price,
        description: values.description,
      };

      await updateProduct(data.id, dataValues);

      toast({
        variant: "success",
        title: "Sucesso.",
        description: "Dados atualizados no Sistema!",
      });
      setOpen(false);
    } catch (err: unknown) {
      const error = err as ApiErrorProps;
      toast({
        variant: "destructive",
        title: "Ocorreu um erro ao editar os dados.",
        description: error?.message,
      });
      setOpen(false);
    } finally {
      setBlockConfirm(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <SelectItems
                      title="Selecione a Categoria"
                      items={categoryTypes}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="" maxLength={250} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <AsyncButton type="submit" loading={blockConfirm} title="Salvar" />
        </DialogFooter>
      </form>
    </Form>
  );
}
