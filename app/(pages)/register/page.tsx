import { Metadata } from "next";
import SignupForm from "@/components/forms/signup-form";


export const metadata: Metadata = {
    title: "Inscrição",
    description: "Inscrição no sistema.",
};

export default async function AuthenticationPage() {

    return (
        <div className="relative h-screen flex-col items-center justify-center ">
            <div className="p-4 lg:p-8 h-full flex items-center ">
                <div className="p-8 rounded-md border mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Faça o cadastro
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Cadastre novas credenciais de acesso.
                        </p>
                    </div>
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}
