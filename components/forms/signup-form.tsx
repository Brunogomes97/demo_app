"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Campo Requerido" })
      .max(30, { message: "Max de 30 caracteres" }),
    email: z.string().email({ message: "Insira um email válido" }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
  });

type UserFormValue = z.infer<typeof formSchema>;

export default function SignupForm() {
  const router = useRouter();

  const defaultValues = {
    email: "",
    password: "",
    username: "",
    passwordConfirm: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (
    data: UserFormValue,
    event?: React.BaseSyntheticEvent | FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    try {
      const { email, password, username } = data;
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", username);

      const response = await fetch(`/register/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao autenticar");
      }

      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Usuário Registrado com sucesso!",
      });
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro ao realizar operação!",
        description: error?.message,
      });
      console.log(error);
    } finally {
      form.reset();
    }
  };
  return <AuthFormulary form={form} onSubmit={onSubmit} />;
}

interface AuthFormularyProps {
  form: UseFormReturn<UserFormValue>;
  onSubmit: (
    data: UserFormValue,
    event?: React.BaseSyntheticEvent | FormEvent<HTMLFormElement>
  ) => void;
}

function AuthFormulary({ form, onSubmit }: AuthFormularyProps) {
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Coloque o seu email..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de Usuário</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Coloque o seu nome de usuário..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Coloque o sua Senha..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirme a sua Senha..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              disabled={isSubmitting}
              className="w-full mt-4"
              type="submit"
            >
              {isSubmitting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground"></span>
        </div>
      </div>
    </>
  );
}
