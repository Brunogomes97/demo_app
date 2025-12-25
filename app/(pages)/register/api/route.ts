import { baseURL } from "@/services/url";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password, username } = await request.json();

        // Chama a API externa 
        const response = await fetch(`${baseURL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, username }),
            // credentials: "include",

        });
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message }, { status: response.status });
        }

        return NextResponse.json({ message: "Usuário criado com sucesso" }, { status: 201 });

    } catch {
        return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
    }
}


