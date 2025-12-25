"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  return (
    <div className="bg-background flex justify-center items-center h-screen">
      <Button onClick={() => {
        toast({
          variant: "success",
          title: "Sucesso.",
          description: "Cadastro Registrado no Sistema!",
        });

      }}>confirm</Button>
    </div>
  );
}
