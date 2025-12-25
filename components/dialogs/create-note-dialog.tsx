"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
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
import { useState } from "react";
import { SelectItems } from "@/components/select-items";
import { categoryTypes } from "@/components/constants/data";
import { ApiErrorProps } from "@/lib/types";
import AsyncButton from "@/components/ui/async-button";
import { toast } from "@/hooks/use-toast";
import { createProduct } from "@/app/(pages)/dashboard/actions";
import { ProductCreateForm } from "@/app/(pages)/dashboard/types";
import { NumericFormat } from "react-number-format";

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
};

export function CreateNoteDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn(buttonVariants({ variant: "default" }))}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Realize o cadastro do Produto preenchendo os campos abaixo:
          </DialogDescription>
        </DialogHeader>
        <FormContent open={open} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function FormContent({ setOpen }: FormContentType) {
  const [blockConfirm, setBlockConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Meu Produto",
      category: "Eletrônicos",
      price: 0,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setBlockConfirm(true);
    try {
      const data = {
        name: values.name,
        category: values.category as ProductCreateForm["category"],
        price: values.price,
        description: values.description,
      };
      await createProduct(data);
      toast({
        variant: "success",
        title: "Sucesso.",
        description: "Nota Registrada no Sistema!",
      });
      setOpen(false);
    } catch (err: unknown) {
      const error = err as ApiErrorProps;

      toast({
        variant: "destructive",
        title: "Ocorreu um erro ao realizar o cadastro .",
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
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
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
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? 0);
                      }}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      prefix="R$ "
                      customInput={Input}
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
