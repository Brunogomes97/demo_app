import { AuthSessionResponse } from "@/lib/types";
import { fetchAPI } from "@/services/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { baseURL } from "@/services/url";


//GET Session
export async function GET(): Promise<Response> {
    //const token = request.cookies.get("session_token")?.value ?? null;
    const cookiesStore = await cookies();
    const token = cookiesStore.get("access_token")?.value ?? null;
    try {
        if (token === null) {
            return new Response(null, {
                status: 401
            });
        }
        const data = await fetchAPI<AuthSessionResponse>("auth/session")
        const user = data?.user

        if (user === null) {
            return new Response(null, {
                status: 401
            });
        }

        return NextResponse.json({ user });
    } catch {

        cookiesStore.set("access_token", "", {
            httpOnly: true,
            sameSite: "lax",
            // secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/"
        });

        return new Response(null, {
            status: 401
        });
    }
}

//new Session (login)
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const cookiesStore = await cookies(); // Agora é assíncrono

        // Chama a API externa para autenticação
        const response = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message }, { status: response.status });
        }

        const { token, ...data } = await response.json();

        // Define o cookie usando a API assíncrona
        cookiesStore.set("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            // secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: "/",
        });

        return NextResponse.json(data, { status: 200 });

    } catch {
        // console.error("Erro no servidor:", error);
        return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
    }
}

//Remove Session (logout)
export async function DELETE(): Promise<Response> {
    const cookiesStore = await cookies();
    cookiesStore.set("access_token", "", {
        httpOnly: true,
        sameSite: "lax",
        // secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/"
    });

    return new Response(null, {
        status: 204
    });
}
